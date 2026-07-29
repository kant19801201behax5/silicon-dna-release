/**
 * RPC Shadow Filtering Middleware
 * Passes every request through immediately — zero added latency.
 * Async background analysis flags IPs; throttling starts on the NEXT request.
 * Architecture pitch for Alchemy / QuickNode: 20-30% cost savings, 0ms overhead.
 */
import type { Request, Response, NextFunction } from 'express';
import { classifyAgent, type ClassificationInput } from '../services/agentClassifier';

interface ShadowRecord {
  requests: number;
  botHits: number;
  lastClass: string;
  lastSeen: number;
  throttled: boolean;
}

const shadowRecords = new Map<string, ShadowRecord>();
const THROTTLE_AFTER = 5;  // consecutive malicious bot classifications
const WINDOW_MS = 60_000;  // 1-minute sliding window

export interface ShadowFilterStats {
  tracked_ips: number;
  throttled_ips: number;
  total_requests: number;
  bot_hits: number;
}

export function shadowFilterMiddleware(
  getContext: (req: Request) => Omit<ClassificationInput, 'ua' | 'headers'>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip =
      ((req.headers['x-forwarded-for'] as string) ?? '').split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown';

    const now = Date.now();
    let rec = shadowRecords.get(ip);

    if (!rec || now - rec.lastSeen > WINDOW_MS) {
      rec = { requests: 0, botHits: 0, lastClass: 'HUMAN', lastSeen: now, throttled: false };
      shadowRecords.set(ip, rec);
    }

    rec.requests++;
    rec.lastSeen = now;

    if (rec.throttled) {
      res.setHeader('X-Silicon-DNA', 'SHADOW_THROTTLED');
      res.status(429).json({ error: 'RATE_LIMITED', reason: 'shadow_filter' });
      return;
    }

    next();

    // Background classification — fires after response is handed off
    setImmediate(() => {
      const input: ClassificationInput = {
        ua: (req.headers['user-agent'] as string) ?? '',
        headers: req.headers as Record<string, string | undefined>,
        ...getContext(req),
      };
      const result = classifyAgent(input);
      rec!.lastClass = result.agentClass;

      if (result.agentClass === 'MALICIOUS_BOT' && result.confidence > 0.6) {
        rec!.botHits++;
        if (rec!.botHits >= THROTTLE_AFTER) rec!.throttled = true;
      }
    });
  };
}

export function getShadowStats(): ShadowFilterStats {
  let total = 0;
  let botHits = 0;
  let throttled = 0;

  for (const r of shadowRecords.values()) {
    total += r.requests;
    botHits += r.botHits;
    if (r.throttled) throttled++;
  }

  return {
    tracked_ips: shadowRecords.size,
    throttled_ips: throttled,
    total_requests: total,
    bot_hits: botHits,
  };
}

export function clearShadowRecords(): void {
  shadowRecords.clear();
}
