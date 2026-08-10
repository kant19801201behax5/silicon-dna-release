
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createMlKem768 } from 'mlkem';

import { Worker } from 'node:worker_threads';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'path';
import { performance } from 'perf_hooks';
import { LRUCache } from 'lru-cache';
import { updateNoise } from './src/services/noiseBridge';
import * as rhythmManager from './src/services/rhythmManager';
import * as sealValidator from './src/services/sealValidator';
import { shannonEntropy, calculateAutocorrelation, spearmanRankCorrelation } from './src/utils/math';
import { argon2id } from 'hash-wasm';
import { persistBan, persistProfile, loadActiveBans, loadProfile, logEvent } from './src/db/persist';
import { SybilCluster } from './src/services/sybilCluster';
import { classifyAgent } from './src/services/agentClassifier';
import { detectAutomation } from './src/services/automationDetector';
import { getShadowStats, clearShadowRecords } from './src/middleware/shadowFilter';
import { computeBehavioralHash, validateSignatureStructure, bindWallet, lookupWallet, getWalletsByHash, getBindingStats, clearBindings } from './src/services/walletBinder';
import { issueProof, redeemProof, clearProofs, type LayerResult } from './src/services/zkProof';
import { evaluateTrust } from './src/services/trustEngine';
import {
  pqcSessionSignal, automationSignal, frankensteinSignal,
  rhythmTrustSignal, classifierSignal, walletSybilSignal,
} from './src/services/trustSignals';

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  const PORT = Number(process.env.PORT) || 3000;

  let mode: 'IDLE' | 'STRESS' | 'SNIPER' = 'IDLE';
  const startTime = Date.now();
  let globalPassedCount = 0;
  let globalDroppedCount = 0;
  let sniperArmed = false;

  // Phase 58.0: Live rules pulled from JARVIS every 60s (sigma2, rho, argon2 thresholds)
  let liveRules = { sigma2: 2.0, rho: 0.3, argon2: { time: 3, memory: 65536, parallelism: 4 } };
  const JARVIS_URL = process.env.JARVIS_URL || '';
  if (JARVIS_URL) {
    const syncRules = () => {
      fetch(`${JARVIS_URL}/api/admin/rules`, {
        headers: process.env.JARVIS_TOKEN ? { Authorization: 'Bearer ' + process.env.JARVIS_TOKEN } : {},
      })
        .then(r => r.json())
        .then((data: any) => {
          if (data?.rules) {
            liveRules = { ...liveRules, ...data.rules };
            console.log(`[🧬 DNA-RULES] Synced: σ²=${liveRules.sigma2} ρ=${liveRules.rho}`);
          }
        })
        .catch((e: Error) => console.warn(`[DNA-RULES] sync failed: ${e.message}`));
    };
    syncRules();
    setInterval(syncRules, 60_000);
  }
  // Auto-calibration: collect σ² samples, adjust liveRules.sigma2 every 5 min
  const varianceSamples: number[] = [];
  const MAX_SAMPLES = 2000;
  setInterval(() => {
    if (varianceSamples.length < 50) return;
    const sorted = [...varianceSamples].sort((a, b) => a - b);
    const p10 = sorted[Math.floor(sorted.length * 0.10)];
    const newSigma2 = Math.max(1.0, Math.min(5.0, p10 * 1.5));
    if (Math.abs(newSigma2 - liveRules.sigma2) > 0.1) {
      liveRules.sigma2 = Number(newSigma2.toFixed(2));
      console.log(`[🧬 AUTO-CAL] σ² → ${liveRules.sigma2} (p10=${p10.toFixed(2)}, n=${varianceSamples.length})`);
    }
    varianceSamples.length = 0;
  }, 5 * 60 * 1000);

  // ── Sybil Cluster (cross-IP cohort detection) ──────────────────────────────
  const sybilCluster = new SybilCluster();

  // ── PQC cooldown flag: jitter readings taken during ML-KEM CPU spike are discarded ──
  // ML-KEM-768 generateKeyPair() and decap() are CPU-intensive lattice operations.
  // On a shared-core VPS they contaminate probe-worker hrtime measurements via
  // CPU time-slicing. We mark a window after each KEM operation as "dirty" and
  // skip those jitter batches to preserve L7 measurement integrity.
  let pqcCooldownUntil = 0; // unix ms — skip jitter batches while Date.now() < this

  // ── Health Decay (STRATEGY_2026.md) ─────────────────────────────────────────
  // Tracks freshness of jitter measurements to expose operational status.
  // operational = fresh (<60s) | degraded = stale (60-300s) | unavailable = dead (>300s)
  // Protocols MUST know when the radar goes blind → safe:null if degraded/unavailable.
  let lastJitterTs = 0;

  function getHealthStatus(): { health: 'operational' | 'degraded' | 'unavailable' } {
    if (lastJitterTs === 0) return { health: 'unavailable' };
    const age = Date.now() - lastJitterTs;
    if (age < 60_000)  return { health: 'operational' };
    if (age < 300_000) return { health: 'degraded' };
    return { health: 'unavailable' };
  }

  let lastClientIp = 'unknown'; // tracks last WS client for per-IP trustScore in metrics
  let lastSpearmanRho = 0.5;   // last computed ρ from microStall (fed into quantum DNA hash)

  type CurrentMetrics = {
    mean: number; variance: number; entropy: number; autocorr: number;
    temp: number; pol: number; histogram: number[]; dnaHash: string;
    trustScore: number; keyRatchetCycles: number;
    mode: 'IDLE' | 'STRESS' | 'SNIPER';
  };

  let currentMetrics: CurrentMetrics = {
    mean: 0, variance: 0, entropy: 0, autocorr: 0,
    temp: 35.0, pol: 0, histogram: Array(60).fill(0),
    dnaHash: 'INITIALIZING...', trustScore: 1.0, keyRatchetCycles: 0, mode: 'IDLE'
  };

  // COOP/COEP — required for SharedArrayBuffer + Atomics.wait in browser workers
  app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });

  const requestLog = new Map<string, number[]>();

  // ── UNIFIED BAN SYSTEM ─────────────────────────────────────────────────────
  // Single LRU with TTL — replaces the old Set<string> + manual setTimeout pattern.
  // All ban paths (Frankenstein, Spearman, Variance, PoW abuse) write here.
  const bannedIPs = new LRUCache<string, { reason: string; ts: number }>({
    max: 100000,
    ttl: 1000 * 60 * 60, // 1h isolation
  });

  // Warm LRU from persisted bans — bans survive server restarts
  for (const { ip, reason, ts } of loadActiveBans()) {
    bannedIPs.set(ip, { reason, ts });
  }

  // LRU with 5-min TTL prevents accumulation on abandoned challenges
  const pendingChallenges = new LRUCache<string, {
    target: string; startTime: number; m_cost: number; t_cost: number;
  }>({ max: 10000, ttl: 1000 * 60 * 5 });

  const verifiedPoW = new LRUCache<string, {
    nonce: string; calcTime: number; m_cost: number; verifiedAt: number;
  }>({ max: 10000, ttl: 1000 * 60 * 5 });

  const sessionKeys = new LRUCache<string, { key: Buffer; counter: number }>({
    max: 5000, ttl: 1000 * 60 * 60
  });

  const packetSequences = new LRUCache<string, number>({
    max: 5000, ttl: 1000 * 60 * 10
  });

  const globalPowGovernor = { count: 0, lastReset: Date.now() };
  const POW_LIMIT_PER_SEC = 50;

  const argonProfiles = new LRUCache<string, {
    m_cost: number; t_cost: number; successes: number;
  }>({ max: 10000, ttl: 1000 * 60 * 60 * 24 });

  // argonProfiles: also warm from persisted profiles on startup (handled per-request via loadProfile fallback)

  interface StallRecord { serverDelays: number[]; clientGaps: number[]; lastReq?: number; }
  const stallHistory = new LRUCache<string, StallRecord>({
    max: 50000, ttl: 1000 * 60 * 5
  });

  // ── THREAT BROADCAST ───────────────────────────────────────────────────────
  function broadcastThreat(ip: string, threatType: string, details: Record<string, unknown>) {
    // Truncate IP for privacy in logs
    const safeIp = ip.slice(-8);
    const event = JSON.stringify({ type: 'SILICON_THREAT', ip: safeIp, threatType, details, t: Date.now() });
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) client.send(event);
    });
  }

  // ── QUANTUM DNA HASH ───────────────────────────────────────────────────────
  function computeQuantumDNAHash(
    sessionKey: Buffer,
    jitterMean: number, jitterVar: number, spearmanRho: number,
    powTotalTime: number, powMemCost: number, powHash: string
  ): string {
    const buf = Buffer.allocUnsafe(8 + 8 + 8 + 8 + 4 + 32);
    let offset = 0;
    buf.writeDoubleBE(jitterMean, offset);   offset += 8;
    buf.writeDoubleBE(jitterVar, offset);    offset += 8;
    buf.writeDoubleBE(spearmanRho, offset);  offset += 8;
    buf.writeDoubleBE(powTotalTime, offset); offset += 8;
    buf.writeUInt32BE(powMemCost, offset);   offset += 4;
    // Pad powHash to 64 hex chars if shorter
    Buffer.from(powHash.slice(0, 64).padEnd(64, '0'), 'hex').copy(buf, offset);
    return crypto.createHmac('sha256', sessionKey).update(buf).digest('hex');
  }

  // ── MICRO-STALL MIDDLEWARE (L3: Spearman Grey Zone) ────────────────────────
  const microStallMiddleware = async (
    req: express.Request, res: express.Response, next: express.NextFunction
  ) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    if (bannedIPs.has(ip)) {
      globalDroppedCount++;
      req.socket.destroy();
      return;
    }

    const record = stallHistory.get(ip) || { serverDelays: [], clientGaps: [], lastReq: undefined };
    const now = Date.now();

    // Collect client reaction gap to previous stall
    if (record.lastReq !== undefined) {
      const gap = now - record.lastReq;
      if (gap > 0 && gap < 30000 && record.serverDelays.length > record.clientGaps.length) {
        record.clientGaps.push(gap);
      }
    }
    record.lastReq = now;

    // Evaluate once we have 7+ pairs
    if (record.clientGaps.length >= 7) {
      const rho = spearmanRankCorrelation(
        record.serverDelays.slice(-7),
        record.clientGaps.slice(-7)
      );
      if (!isNaN(rho)) lastSpearmanRho = rho;

      if (isNaN(rho) || rho < liveRules.rho) {
        const rhoStr = isNaN(rho) ? 'NaN' : rho.toFixed(3);
        console.warn(`[SNIPER: KILL] Static script ρ=${rhoStr}. IP: ${ip}`);
        globalDroppedCount++;
        bannedIPs.set(ip, { reason: `Spearman ρ=${rhoStr}`, ts: Date.now() });
        persistBan(ip, `Spearman ρ=${rhoStr}`, 1000 * 60 * 60);
        logEvent(ip, 'STATIC_SCRIPT', { rho: isNaN(rho) ? null : rho });
        broadcastThreat(ip, 'STATIC_SCRIPT', { rho: isNaN(rho) ? null : rho, threshold: 0.3 });
        stallHistory.delete(ip);
        req.socket.destroy();
        return;
      }

      if (rho < 0.6) {
        (res.locals as any).greyZone = true;
        (res.locals as any).c_tox = 0.85;
        console.log(`[SNIPER: GREY] Grey zone ρ=${rho.toFixed(3)}. IP: ${ip}`);
        broadcastThreat(ip, 'GREY_ZONE', { rho, range: '0.3–0.6' });
      }

      // Reset pairs after evaluation
      record.serverDelays = [];
      record.clientGaps = [];
    }
    stallHistory.set(ip, record);

    // Inject stall only in SNIPER mode and when toxicity warrants it
    const toxicity = (res.locals as any).c_tox ?? 0.5;
    const isGrayZone = sniperArmed && (toxicity >= 0.2 || (res.locals as any).greyZone);
    const stallMs = isGrayZone ? Math.floor(5 + Math.random() * 25) : 0;

    if (stallMs > 0) await new Promise(resolve => setTimeout(resolve, stallMs));

    const stallStart = Date.now();
    res.once('finish', () => {
      if (stallMs > 0) {
        const updated = stallHistory.get(ip);
        if (updated) {
          updated.serverDelays.push(Date.now() - stallStart);
          stallHistory.set(ip, updated);
        }
      }
    });

    next();
  };

  // ── DIGITAL FRANKENSTEIN DETECTOR ─────────────────────────────────────────
  const checkConsistency = (req: express.Request): number => {
    const ua = req.headers['user-agent'] || '';
    const platform = (req.headers['sec-ch-ua-platform'] as string) || '';
    const fetchMode = req.headers['sec-fetch-mode'];

    let score = 0;
    if (ua.includes('Mozilla') && !fetchMode) score += 40;
    if (ua.includes('Windows') && platform === '"Linux"') score += 50;
    if (ua.includes('Macintosh') && platform === '"Windows"') score += 50;
    if (ua.includes('Chrome') && !req.headers['sec-ch-ua']) score += 30;
    if (req.headers['x-puppeteer-version'] || req.headers['x-selenium-id']) score += 100;
    return score;
  };

  // ── SNIPER FILTER ──────────────────────────────────────────────────────────
  const sniperFilter = (
    req: express.Request, res: express.Response, next: express.NextFunction
  ) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    if (bannedIPs.has(ip)) {
      globalDroppedCount++;
      req.socket.destroy();
      return;
    }

    const toxScore = checkConsistency(req);
    (res.locals as any).c_tox = toxScore / 100;

    if (toxScore >= 100) {
      const reason = `Frankenstein score=${toxScore}`;
      bannedIPs.set(ip, { reason, ts: Date.now() });
      persistBan(ip, reason, 1000 * 60 * 60);
      logEvent(ip, 'FRANKENSTEIN', { toxScore });
      globalDroppedCount++;
      broadcastThreat(ip, 'FRANKENSTEIN', {
        toxScore,
        ua: (req.headers['user-agent'] || '').slice(0, 80)
      });
      console.warn(`[SNIPER: DROP] ${reason}. IP: ${ip}`);
      req.socket.destroy();
      return;
    }

    if (!sniperArmed) return next();

    const now = performance.now();
    const timestamps = requestLog.get(ip) || [];
    timestamps.push(now);
    if (timestamps.length > 20) timestamps.shift();
    requestLog.set(ip, timestamps);

    if (timestamps.length >= 10) {
      const intervals: number[] = [];
      for (let i = 1; i < timestamps.length; i++) {
        intervals.push(timestamps[i] - timestamps[i - 1]);
      }
      const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const v = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;
      const r1 = calculateAutocorrelation(intervals);

      // Perfect rhythm (bot) OR high variance with no autocorr memory (Math.random noise)
      if (varianceSamples.length < MAX_SAMPLES) varianceSamples.push(v);
      const isSynthetic = v < liveRules.sigma2 || (v > 10 && Math.abs(r1) < 0.1);

      if (isSynthetic) {
        const reason = `Synthetic rhythm σ²=${v.toFixed(3)} R1=${r1.toFixed(3)}`;
        bannedIPs.set(ip, { reason, ts: Date.now() });
        persistBan(ip, reason, 1000 * 60 * 60);
        logEvent(ip, 'SYNTHETIC_RHYTHM', { variance: v, autocorr: r1 });
        globalDroppedCount++;
        broadcastThreat(ip, 'SYNTHETIC_RHYTHM', { variance: v, autocorr: r1 });
        console.warn(`[SNIPER: DROP] ${reason}. IP: ${ip}`);
        req.socket.destroy();
        return;
      }
    }

    globalPassedCount++;
    next();
  };

  // ── /api/challenge ─────────────────────────────────────────────────────────
  app.get('/api/challenge', (req, res) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    if (now - globalPowGovernor.lastReset > 1000) {
      globalPowGovernor.count = 0;
      globalPowGovernor.lastReset = now;
    }
    if (globalPowGovernor.count >= POW_LIMIT_PER_SEC) {
      return res.status(429).json({ error: 'GLOBAL_STRESS_THRESHOLD', retryAfter: 1 });
    }
    globalPowGovernor.count++;

    const target = crypto.randomBytes(32).toString('hex');
    const profile = argonProfiles.get(ip) || { m_cost: liveRules.argon2.memory, t_cost: liveRules.argon2.time, successes: 0 };
    pendingChallenges.set(ip, { target, startTime: now, m_cost: profile.m_cost, t_cost: profile.t_cost });
    res.json({ target, m_cost: profile.m_cost, t_cost: profile.t_cost, p: 1 });
  });

  // ── /api/verify-pow ────────────────────────────────────────────────────────
  app.post('/api/verify-pow', express.json(), async (req, res) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const { hash, calcTime, m_cost, fp } = req.body;
    const challenge = pendingChallenges.get(ip);

    if (!challenge) return res.status(403).json({ error: 'NO_CHALLENGE' });

    // GPU vs UA consistency (L1.1)
    if (fp?.gpu && typeof fp.gpu === 'string') {
      const ua = req.headers['user-agent'] || '';
      const gpuStr = fp.gpu as string;
      const isMacUA = ua.includes('Macintosh');
      const hasAppleGpu = gpuStr.includes('Apple') || gpuStr.includes('Metal');
      const gpuKnown = !gpuStr.includes('unknown') && !gpuStr.includes('error');
      if (isMacUA && !hasAppleGpu && gpuKnown) {
        const reason = `GPU/UA mismatch: ${gpuStr.slice(0, 50)}`;
        bannedIPs.set(ip, { reason, ts: Date.now() });
        persistBan(ip, reason, 1000 * 60 * 60);
        logEvent(ip, 'FINGERPRINT_MISMATCH', { gpu: gpuStr.slice(0, 40) });
        broadcastThreat(ip, 'FINGERPRINT_MISMATCH', { gpu: gpuStr.slice(0, 60), ua: ua.slice(0, 60) });
        console.warn(`[SNIPER: KILL] ${reason}. IP: ${ip}`);
        req.socket.destroy();
        return;
      }
    }

    // Automation / WebDriver artifact detection (L1.2)
    const automation = detectAutomation({
      webdriver: fp?.webdriver,
      hasChromedriverCdc: fp?.hasChromedriverCdc,
      hasPhantomArtifact: fp?.hasPhantomArtifact,
      hasNightmareArtifact: fp?.hasNightmareArtifact,
      pluginsLength: fp?.pluginsLength,
      languagesEmpty: fp?.languagesEmpty,
    });
    if (automation.detected) {
      const reason = "Automation detected: " + automation.reasons.join(', ');
      bannedIPs.set(ip, { reason, ts: Date.now() });
      persistBan(ip, reason, 1000 * 60 * 60);
      logEvent(ip, 'AUTOMATION_DETECTED', { reasons: automation.reasons });
      broadcastThreat(ip, 'AUTOMATION_DETECTED', { reasons: automation.reasons });
      console.warn('[SNIPER: KILL] ' + reason + '. IP: ' + ip);
      req.socket.destroy();
      return;
    }

    // Minimum theoretical Argon2 time (ASIC/GPU spoof guard)
    const t_min = (m_cost / 1024) * 0.8;
    if (typeof calcTime === 'number' && calcTime < t_min) {
      const reason = `ASIC spoof T_calc=${calcTime.toFixed(1)} < T_min=${t_min.toFixed(1)}`;
      bannedIPs.set(ip, { reason, ts: Date.now() });
      persistBan(ip, reason, 1000 * 60 * 60);
      logEvent(ip, 'ASIC_SPOOF', { calcTime, t_min });
      broadcastThreat(ip, 'ASIC_SPOOF', { calcTime, t_min });
      console.warn(`[SNIPER: KILL] ${reason}. IP: ${ip}`);
      req.socket.destroy();
      return;
    }

    // Slow-time attack: client claims more time than server wall clock allows
    const T_total = Date.now() - challenge.startTime;
    const RTT_GRACE = 70;
    if (typeof calcTime === 'number' && calcTime > T_total + RTT_GRACE) {
      const reason = `Slow-time attack T_claimed=${calcTime} > T_wall=${T_total}`;
      bannedIPs.set(ip, { reason, ts: Date.now() });
      persistBan(ip, reason, 1000 * 60 * 60);
      logEvent(ip, 'SLOW_TIME_ATTACK', { calcTime, T_total });
      broadcastThreat(ip, 'SLOW_TIME_ATTACK', { calcTime, T_total });
      console.warn(`[SNIPER: KILL] ${reason}. IP: ${ip}`);
      req.socket.destroy();
      return;
    }

    // Structural validation: argon2-browser returns 64-char hex for hashLen=32
    const isValid = typeof hash === 'string' && /^[0-9a-f]{64}$/i.test(hash);
    if (!isValid) {
      return res.status(401).json({ error: 'INVALID_POW_STRUCTURE' });
    }

    // Delete challenge before verification — prevents replay even if verification is slow
    const verifiedChallenge = challenge;
    pendingChallenges.delete(ip);

    // ── REAL SERVER-SIDE ARGON2ID VERIFICATION ──────────────────────────────
    // Recomputes argon2id(target, salt='quantum_salt_3.2') and compares with
    // the submitted hash. A forged hash that doesn't match kills the session.
    try {
      const serverHash = await argon2id({
        password: verifiedChallenge.target,
        salt: 'quantum_salt_3.2',
        iterations: verifiedChallenge.t_cost,
        memorySize: m_cost,
        hashLength: 32,
        parallelism: 1,
        outputType: 'hex',
      });

      if (serverHash !== hash.toLowerCase()) {
        const reason = 'PoW hash forgery — submitted hash != argon2id(target)';
        bannedIPs.set(ip, { reason, ts: Date.now() });
        persistBan(ip, reason, 1000 * 60 * 60);
        logEvent(ip, 'POW_FORGERY', { submitted: hash.slice(0, 16) });
        broadcastThreat(ip, 'POW_FORGERY', {
          submitted: hash.slice(0, 16) + '...',
          expected: serverHash.slice(0, 16) + '...',
        });
        console.warn(`[SNIPER: KILL] PoW forgery detected. IP: ${ip}`);
        return res.status(403).json({ error: 'POW_HASH_INVALID' });
      }
    } catch (err) {
      console.error('[PoW] Argon2 server verify error:', err);
      return res.status(500).json({ error: 'POW_VERIFY_ERROR' });
    }

    verifiedPoW.set(ip, { nonce: hash, calcTime, m_cost, verifiedAt: Date.now() });

    const persisted = loadProfile(ip);
    const profile = argonProfiles.get(ip) || {
      m_cost: persisted?.m_cost ?? liveRules.argon2.memory,
      t_cost: persisted?.t_cost ?? liveRules.argon2.time,
      successes: persisted?.successes ?? 0,
    };
    profile.successes++;
    if (calcTime < 150) profile.m_cost = Math.min(profile.m_cost * 2, 131072);
    else if (calcTime > 600) profile.m_cost = Math.max(profile.m_cost / 1.5, 8192);
    argonProfiles.set(ip, profile);
    persistProfile(ip, { m_cost: profile.m_cost, t_cost: profile.t_cost, successes: profile.successes });

    res.json({ status: 'VERIFIED', next_m_cost: profile.m_cost });
  });

  // ── /api/sync-pulse ────────────────────────────────────────────────────────
  app.get('/api/sync-pulse', (req, res) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'global';
    const entry = sessionKeys.get('default');
    if (!entry) return res.status(403).json({ error: 'PQC_SESSION_NOT_ESTABLISHED' });
    const pulse = rhythmManager.generateSyncPulse(ip, entry.key);
    res.json({ pulse, driftAdjustment: rhythmManager.getDriftAdjustment(ip) });
  });

  app.post('/api/verify-rhythm', express.json(), (req, res) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'global';
    const { timings } = req.body;
    const result = rhythmManager.validateRhythm(ip, timings);
    res.json(result);
  });

  // ── /api/enclave (Protected) ───────────────────────────────────────────────
  app.get('/api/enclave', sniperFilter, microStallMiddleware, (req, res) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const pow = verifiedPoW.get(ip);

    const sealHeader = req.headers['x-silicon-dna-seal'] as string;
    const noiseHeader = req.headers['x-silicon-dna-noise'] as string;
    const entry = sessionKeys.get('default');

    if (!entry) return res.status(403).json({ error: 'PQC_SESSION_NOT_ESTABLISHED' });

    const expectedSeq = (packetSequences.get(ip) || 0) + 1;

    // sessionId='default' matches client generateSeal which prefixes 'default'
    const { valid, requiresArgon2 } = sealValidator.verifyEntropySeal(
      'default', sealHeader, noiseHeader, expectedSeq, entry.key
    );

    if (!valid) {
      console.warn(`[SNIPER: DROP] Entropy Seal Failure seq=${expectedSeq}. IP: ${ip}`);
      globalDroppedCount++;
      return res.status(403).json({ error: 'ENTROPY_SEAL_INVALID' });
    }

    // Key ratcheting — evolve key with physical noise from client every 50 packets
    entry.counter++;
    if (entry.counter >= 50) {
      const noiseSum = noiseHeader
        ? noiseHeader.split(',').map(Number).filter(isFinite).reduce((a, b) => a + b, 0)
        : Math.random();
      entry.key = crypto.createHash('sha256')
        .update(Buffer.concat([entry.key, Buffer.from(noiseSum.toString())]))
        .digest();
      entry.counter = 0;
      sessionKeys.set('default', entry);
      currentMetrics.keyRatchetCycles++;
      console.log(`[PQC: RATCHET] Key rotation #${currentMetrics.keyRatchetCycles}`);
    }

    packetSequences.set(ip, expectedSeq);

    if (sniperArmed && !pow && requiresArgon2) {
      return res.status(403).json({ error: 'ACTIVE_INTERROGATION_REQUIRED' });
    }

    res.json({ asset: 'Cognitive_Enclave', status: 'PROTECTED', dna: currentMetrics.dnaHash });
  });

  // ── /api/wallet (Protected) ────────────────────────────────────────────────
  app.get('/api/wallet', sniperFilter, microStallMiddleware, (req, res) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const pow = verifiedPoW.get(ip);
    if (sniperArmed && !pow) return res.status(403).json({ error: 'ACTIVE_INTERROGATION_REQUIRED' });
    res.json({ asset: 'Crypto_Wallet', status: 'PROTECTED', dna: currentMetrics.dnaHash });
  });

  // ── /metrics (Prometheus) ─────────────────────────────────────────────────
  app.get('/metrics', (_req, res) => {
    res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    const modeNum = currentMetrics.mode === 'IDLE' ? 0 : currentMetrics.mode === 'STRESS' ? 1 : 2;
    const lines = [
      `# HELP silicon_dna_jitter_mean_us Mean CPU jitter (microseconds)`,
      `# TYPE silicon_dna_jitter_mean_us gauge`,
      `silicon_dna_jitter_mean_us ${currentMetrics.mean}`,
      `# HELP silicon_dna_jitter_variance Jitter variance (us^2)`,
      `# TYPE silicon_dna_jitter_variance gauge`,
      `silicon_dna_jitter_variance ${currentMetrics.variance}`,
      `# HELP silicon_dna_entropy_bits Shannon entropy (bits)`,
      `# TYPE silicon_dna_entropy_bits gauge`,
      `silicon_dna_entropy_bits ${currentMetrics.entropy}`,
      `# HELP silicon_dna_autocorr_r1 Autocorrelation lag-1`,
      `# TYPE silicon_dna_autocorr_r1 gauge`,
      `silicon_dna_autocorr_r1 ${currentMetrics.autocorr}`,
      `# HELP silicon_dna_temperature_celsius Thermal profile (simulated)`,
      `# TYPE silicon_dna_temperature_celsius gauge`,
      `silicon_dna_temperature_celsius ${currentMetrics.temp}`,
      `# HELP silicon_dna_pol_percent Probability of Life 0-100`,
      `# TYPE silicon_dna_pol_percent gauge`,
      `silicon_dna_pol_percent ${currentMetrics.pol}`,
      `# HELP silicon_dna_requests_passed_total Organic requests passed`,
      `# TYPE silicon_dna_requests_passed_total counter`,
      `silicon_dna_requests_passed_total ${globalPassedCount}`,
      `# HELP silicon_dna_requests_dropped_total Synthetic requests dropped`,
      `# TYPE silicon_dna_requests_dropped_total counter`,
      `silicon_dna_requests_dropped_total ${globalDroppedCount}`,
      `# HELP silicon_dna_trust_score Rhythm trust score 0-1`,
      `# TYPE silicon_dna_trust_score gauge`,
      `silicon_dna_trust_score ${currentMetrics.trustScore}`,
      `# HELP silicon_dna_key_ratchet_cycles PQC key rotation count`,
      `# TYPE silicon_dna_key_ratchet_cycles counter`,
      `silicon_dna_key_ratchet_cycles ${currentMetrics.keyRatchetCycles}`,
      `# HELP silicon_dna_spearman_rho Last measured Spearman correlation`,
      `# TYPE silicon_dna_spearman_rho gauge`,
      `silicon_dna_spearman_rho ${lastSpearmanRho}`,
      `# HELP silicon_dna_mode_numeric Mode: 0=IDLE 1=STRESS 2=SNIPER`,
      `# TYPE silicon_dna_mode_numeric gauge`,
      `silicon_dna_mode_numeric ${modeNum}`,
      `# HELP silicon_dna_banned_ips_total Currently banned IP count`,
      `# TYPE silicon_dna_banned_ips_total gauge`,
      `silicon_dna_banned_ips_total ${bannedIPs.size}`,
    ];
    res.send(lines.join('\n') + '\n');
  });

  // ── JITTER PROBE WORKER ────────────────────────────────────────────────────
  const probePath = path.join(process.cwd(), 'probe-worker.mjs');
  const worker = new Worker(probePath);

  worker.on('message', (msg: any) => {
    if (msg.type === 'INTEGRITY_FAIL') {
      console.error('[CRITICAL] eBPF Integrity Audit Failed! Probe worker compromised.');
      return;
    }

    // Discard jitter batch if measured during ML-KEM CPU spike (L0/L7 isolation)
    if (Date.now() < pqcCooldownUntil) {
      return;
    }

    const deltas = msg.deltas as number[];
    updateNoise(deltas);
    lastJitterTs = Date.now(); // Health Decay: L0 probe is alive (before PQC guard)

    const now = Date.now();
    const elapsedSec = (now - startTime) / 1000;

    if (elapsedSec < 10) mode = 'IDLE';
    else if (elapsedSec < 35) mode = 'STRESS';
    else mode = 'SNIPER';
    sniperArmed = mode === 'SNIPER';

    const mean = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    const variance = deltas.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / deltas.length;
    const entropy = shannonEntropy(deltas); // FIXED: real Shannon entropy (was log(variance))
    const r1 = calculateAutocorrelation(deltas);

    const targetTemp = mode === 'STRESS' ? 76.4 : 38.2;
    const friction = variance / 100000;
    currentMetrics.temp += (targetTemp + friction - currentMetrics.temp) * 0.05 + (Math.random() - 0.5) * 0.2;

    const pol = mode === 'SNIPER'
      ? Math.min(99.9, 70 + entropy * 1.2 + Math.abs(r1) * 15 + Math.abs(currentMetrics.temp - 38) * 0.2)
      : 0;

    const bins = Array(60).fill(0);
    const maxVal = mode === 'STRESS' ? 500000 : 50000;
    deltas.forEach(d => { bins[Math.min(59, Math.floor((d / maxVal) * 60))]++; });
    const maxBin = Math.max(...bins, 1);
    const normalizedHistogram = bins.map(b => (b / maxBin) * 100);

    const jitterHash = crypto.createHash('sha256').update(deltas.join(',')).digest('hex');
    const entry = sessionKeys.get('default');
    if (!entry) return; // wait until PQC handshake completes

    // Use IP-specific PoW; fall back to most recent if client hasn't verified yet
    const latestPow = verifiedPoW.get(lastClientIp) ?? Array.from(verifiedPoW.values()).pop();

    const quantumHash = computeQuantumDNAHash(
      entry.key,
      mean / 1000,      // ns → µs
      variance / 1e6,   // ns² → µs²
      lastSpearmanRho,  // FIXED: actual Spearman ρ from microStall filter
      latestPow?.calcTime ?? 0,
      latestPow?.m_cost ?? 0,
      latestPow?.nonce ?? jitterHash
    );

    currentMetrics = {
      ...currentMetrics,
      mean: Number((mean / 1000).toFixed(2)),
      variance: Number((variance / 1e6).toFixed(4)),
      entropy: Number(entropy.toFixed(3)),
      autocorr: Number(r1.toFixed(3)),
      temp: Number(currentMetrics.temp.toFixed(2)),
      pol: Number(pol.toFixed(1)),
      histogram: normalizedHistogram,
      dnaHash: quantumHash,
      // FIXED: use actual client IP session, not hardcoded 'global'
      trustScore: Number(rhythmManager.getTrustStatus(lastClientIp).toFixed(2)),
      mode
    };

    const payload = JSON.stringify({
      ...currentMetrics,
      filterStats: { passed: globalPassedCount, dropped: globalDroppedCount },
      t: (now / 1000 % 100).toFixed(2)
    });

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) client.send(payload);
    });
  });

  // ── WEBSOCKET (ML-KEM-768 Real Handshake — NIST FIPS 203) ─────────────────
  // Pre-initialize KEM instance once at startup (async, reusable)
  const _kemInit = createMlKem768();

  wss.on('connection', (ws, req) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    lastClientIp = ip;

    // Generate real ML-KEM-768 keypair per connection (pk=1184B, sk=2400B)
    // Mark jitter dirty for 150ms: keygen is the heaviest lattice operation
    pqcCooldownUntil = Date.now() + 150;
    _kemInit.then(async (kem) => {
      const [pk, sk] = await kem.generateKeyPair();
      // Keygen done — extend cooldown so probe-worker hrtime settles
      pqcCooldownUntil = Date.now() + 100;
      ws.send(JSON.stringify({ type: 'PQC_INIT', pk: Buffer.from(pk).toString('base64') }));

      ws.on('message', async (msg) => {
        try {
          const data = JSON.parse(msg.toString());
          if (data.type === 'PQC_RESP') {
            const ct = Buffer.from(data.ciphertext, 'base64');
            if (ct.length !== 1088) return;
            // Decap also CPU-heavy — mark dirty before and after
            pqcCooldownUntil = Date.now() + 100;
            const sharedSecret = await kem.decap(new Uint8Array(ct), sk);
            pqcCooldownUntil = Date.now() + 50; // tail cooldown post-decap
            sessionKeys.set('default', { key: Buffer.from(sharedSecret), counter: 0 });
            ws.send(JSON.stringify({ type: 'PQC_ESTABLISHED' }));
            console.log(`[PQC] ML-KEM-768 tunnel established. ss=${Buffer.from(sharedSecret).toString('hex').slice(0,16)}... IP: ${ip}`);
          }
        } catch (_e) { /* malformed JSON ignored */ }
      });
    }).catch((e) => console.error('[PQC] KEM init error:', e));
  });

  // ── Phoenix Zero state (declared here so /api/silicon-metrics can reference) ─
  type PhoenixEvent = { ts: number; type?: string; event?: string; pid?: number; cmd?: string; dst_ip?: string; rtt_ms?: number; [k: string]: unknown };
  const phoenixEvents: PhoenixEvent[] = [];
  const PHOENIX_RING = 500;
  let phoenixExecCount = 0;
  let phoenixTcpCount = 0;
  let phoenixRttEma = 0;
  let phoenixThreatScore = 0;

  // ── /api/silicon-metrics (current snapshot for JARVIS FastAPI) ────────────
  // Returns the same 5 values siliconDnaLink.ts streams over WS, as plain JSON.
  // JARVIS FastAPI calls this when assembling episode.state.vector[485-489].
  app.get('/api/silicon-metrics', (_req, res) => {
    const passed  = globalPassedCount;
    const dropped = globalDroppedCount;
    const total   = passed + dropped;
    const { health } = getHealthStatus();
    res.json({
      // Health Decay (STRATEGY_2026.md): operational / degraded / unavailable
      health,
      safe:            health === 'operational' ? true : null,  // null = radar blind, don't trust
      last_measurement_s: lastJitterTs > 0 ? Math.round((Date.now() - lastJitterTs) / 1000) : null,
      // Core metrics
      bot_drop_rate:   total > 0 ? dropped / total : 0,
      phoenix_threat:  phoenixThreatScore,
      phoenix_exec:    phoenixExecCount,
      phoenix_tcp:     phoenixTcpCount,
      phoenix_rtt_ms:  Math.round(phoenixRttEma * 10) / 10,
      entropy_norm:    currentMetrics.entropy / 8,
      autocorr_norm:   (currentMetrics.autocorr + 1) / 2,
      trust_score:     currentMetrics.trustScore,
      banned_count:    bannedIPs.size,
      mode:            currentMetrics.mode,
      t:               Date.now(),
    });
  });

  // ── /api/check-ip (localhost-only ban-list lookup) ─────────────────────────
  // Lets other local services (e.g. the x402 payment gateway) gate access on
  // Silicon DNA's own bot detection without duplicating ban logic. Read-only,
  // never mutates bannedIPs. Reason string is withheld from the response —
  // only the boolean is meant to leave this box, so a caller who is banned
  // can't use this to calibrate around the specific rule that caught them.
  app.get('/api/check-ip', (req, res) => {
    const remoteIp = req.socket.remoteAddress ?? '';
    const isLocal = remoteIp === '127.0.0.1' || remoteIp === '::1' || remoteIp === '::ffff:127.0.0.1';
    if (!isLocal) { res.status(403).json({ error: 'LOCALHOST_ONLY' }); return; }

    const ip = (req.query.ip as string) || '';
    if (!ip) { res.status(400).json({ error: 'ip query param required' }); return; }
    res.json({ banned: bannedIPs.has(ip) });
  });

  // ── Phoenix Zero eBPF event ingestion ────────────────────────────────────
  // Accepts kernel-level events from phoenix_zero_sensor.py (localhost only).
  // Processes events locally; optionally forwards to JARVIS (fire-and-forget).
  app.post('/api/agent/interact', express.json({ limit: '1mb' }), (req, res) => {
    const remoteIp = req.socket.remoteAddress ?? '';
    const isLocal = remoteIp === '127.0.0.1' || remoteIp === '::1' || remoteIp === '::ffff:127.0.0.1';
    if (!isLocal) { res.status(403).json({ error: 'LOCALHOST_ONLY' }); return; }

    const body = req.body ?? {};
    // Sensor sends: { agent_id, data_type, payload: { events, systemic_risk, ... } }
    // Also accept flat: { events: [...] } for direct testing
    const inner = (body.payload && typeof body.payload === 'object') ? body.payload as Record<string, unknown> : body;
    const rawEvents: unknown[] = Array.isArray(inner.events) ? inner.events
      : Array.isArray(body.events) ? body.events
      : body.event ? [body] : [];

    const systemicRisk = typeof (inner as Record<string, unknown>).systemic_risk === 'number'
      ? (inner as Record<string, unknown>).systemic_risk as number : null;

    for (const raw of rawEvents) {
      if (!raw || typeof raw !== 'object') continue;
      const evt = raw as Record<string, unknown>;
      const entry: PhoenixEvent = { ts: Date.now(), ...evt };
      phoenixEvents.push(entry);
      if (phoenixEvents.length > PHOENIX_RING) phoenixEvents.shift();
      const t = (entry.type ?? entry.event ?? '') as string;
      if (t === 'exec' || t === 'sys_execve') phoenixExecCount++;
      if (t === 'tcp' || t === 'tcp_connect') phoenixTcpCount++;
      if (typeof entry.rtt_ms === 'number') {
        phoenixRttEma = phoenixRttEma === 0 ? entry.rtt_ms : phoenixRttEma * 0.9 + entry.rtt_ms * 0.1;
      }
    }

    // Threat score: use sensor's systemic_risk if available, else velocity heuristic
    if (systemicRisk !== null) {
      phoenixThreatScore = Math.max(phoenixThreatScore * 0.8, systemicRisk);
    } else {
      const windowStart = Date.now() - 10_000;
      const recentCount = phoenixEvents.filter(e => e.ts >= windowStart).length;
      phoenixThreatScore = Math.min(1, recentCount / 100);
    }

    res.json({ ok: true, processed: rawEvents.length, threat_score: phoenixThreatScore });

    // Optional JARVIS forward (fire-and-forget — never blocks sensor)
    const jarvisUrl = process.env.JARVIS_URL;
    if (jarvisUrl) {
      fetch(`${jarvisUrl}/api/agent/interact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(process.env.JARVIS_TOKEN ? { 'Authorization': 'Bearer ' + process.env.JARVIS_TOKEN } : {}) },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(5_000),
      }).catch((err: Error) => console.warn(`[Phoenix→JARVIS] ${err.message}`));
    }
  });

  // Remote calibration — update liveRules thresholds (localhost only)
  app.post('/api/admin/calibrate', express.json(), (req, res) => {
    const ip = req.socket.remoteAddress ?? '';
    if (ip !== '127.0.0.1' && ip !== '::1' && ip !== '::ffff:127.0.0.1') {
      res.status(403).end(); return;
    }
    const { sigma2, rho, argon2 } = req.body ?? {};
    if (typeof sigma2 === 'number' && sigma2 > 0) liveRules.sigma2 = sigma2;
    if (typeof rho === 'number' && rho > 0 && rho < 1) liveRules.rho = rho;
    if (argon2?.time) liveRules.argon2.time = argon2.time;
    if (argon2?.memory) liveRules.argon2.memory = argon2.memory;
    console.log(`[🧬 CALIBRATE] σ²=${liveRules.sigma2} ρ=${liveRules.rho} argon2=${JSON.stringify(liveRules.argon2)}`);
    res.json({ ok: true, rules: liveRules });
  });

  // Demo/test helper — clears in-memory + on-disk bans (localhost only)
  app.post('/api/admin/reset-bans', (req, res) => {
    const ip = req.socket.remoteAddress ?? '';
    if (ip !== '127.0.0.1' && ip !== '::1' && ip !== '::ffff:127.0.0.1') {
      res.status(403).end(); return;
    }
    bannedIPs.clear();
    globalDroppedCount = 0;
    globalPassedCount = 0;
    // Also wipe disk so bans don't reload on restart
    const bansPath = path.join(process.cwd(), 'data', 'bans.json');
    try { fs.writeFileSync(bansPath, '[]'); } catch { /* ignore */ }
    res.json({ ok: true, message: 'Bans cleared (memory + disk)' });
  });

  // Expose Phoenix Zero state for dashboard + external reads
  app.get('/api/phoenix-status', (_req, res) => {
    const windowStart = Date.now() - 10_000;
    res.json({
      running: true,
      exec_total: phoenixExecCount,
      tcp_total: phoenixTcpCount,
      rtt_ema_ms: Math.round(phoenixRttEma * 10) / 10,
      threat_score: phoenixThreatScore,
      recent_10s: phoenixEvents.filter(e => e.ts >= windowStart).length,
      ring_size: phoenixEvents.length,
      last_event: phoenixEvents.at(-1) ?? null,
    });
  });

  // ── /api/health — public health endpoint (Health Decay, STRATEGY_2026.md) ──
  // Returns HTTP 503 when unavailable so load balancers and pull-oracle clients
  // know the radar is blind. Clients MUST treat safe=null as "do not trade".
  app.get('/api/health', (_req, res) => {
    const { health } = getHealthStatus();
    const code = health === 'unavailable' ? 503 : 200;
    res.status(code).json({
      health,
      safe:               health === 'operational' ? true : null,
      mode,               // local var — reflects real elapsedSec-based transitions
      uptime_s:           Math.round((Date.now() - startTime) / 1000),
      last_measurement_s: lastJitterTs > 0 ? Math.round((Date.now() - lastJitterTs) / 1000) : null,
      version:            '5.0.0',
    });
  });

  // Phase 57.8: Push Silicon DNA metrics to JARVIS every 60s
  if (JARVIS_URL) {
    setInterval(() => {
      const total = globalPassedCount + globalDroppedCount;
      const trust = total > 0 ? globalPassedCount / total : 1.0;
      const jitter = currentMetrics.entropy ?? 0.5;
      const sniper = currentMetrics.variance > 0 ? Math.min(currentMetrics.variance / 10, 1) : 0.5;
      const entropy_norm  = (currentMetrics.entropy ?? 0) / 8;
      const autocorr_norm = ((currentMetrics.autocorr ?? 0) + 1) / 2;
      const bot_drop_rate = total > 0 ? globalDroppedCount / total : 0;
      fetch(`${JARVIS_URL}/api/silicon-dna`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(process.env.JARVIS_TOKEN ? { 'Authorization': 'Bearer ' + process.env.JARVIS_TOKEN } : {}) },
        body: JSON.stringify({ jitter, sniper, ja3: 0.5, behavioral: 0.5, trust, entropy_norm, autocorr_norm, bot_drop_rate }),
      }).catch((e: Error) => console.warn(`[DNA→JARVIS] ${e.message}`));
    }, 60_000);
  }

  // ── /api/sybil — cross-IP cohort detection ────────────────────────────────
  app.post('/api/sybil/ingest', express.json(), (req, res) => {
    const remoteIp = req.socket.remoteAddress ?? '';
    const isLocal = remoteIp === '127.0.0.1' || remoteIp === '::1' || remoteIp === '::ffff:127.0.0.1';
    if (!isLocal) { res.status(403).json({ error: 'LOCALHOST_ONLY' }); return; }

    const { ip, entropy, variance, autocorr, spearmanRho, requestIntervals } = req.body ?? {};
    if (!ip || !Array.isArray(requestIntervals)) {
      res.status(400).json({ error: 'MISSING_FIELDS' }); return;
    }
    sybilCluster.ingest(ip, { entropy: entropy ?? 0, variance: variance ?? 0, autocorr: autocorr ?? 0, spearmanRho: spearmanRho ?? 0, requestIntervals });
    res.json({ ok: true, cohort_size: sybilCluster.getCohortSize(ip), stats: sybilCluster.getStats() });
  });

  app.post('/api/sybil/flag', express.json(), (req, res) => {
    const remoteIp = req.socket.remoteAddress ?? '';
    const isLocal = remoteIp === '127.0.0.1' || remoteIp === '::1' || remoteIp === '::ffff:127.0.0.1';
    if (!isLocal) { res.status(403).json({ error: 'LOCALHOST_ONLY' }); return; }

    const { ip } = req.body ?? {};
    if (!ip) { res.status(400).json({ error: 'MISSING_IP' }); return; }
    const count = sybilCluster.flag(ip);
    res.json({ ok: true, count, flagged_cohort_size: count });
  });

  app.get('/api/sybil/stats', (_req, res) => {
    res.json(sybilCluster.getStats());
  });

  // ── /api/classify — 3-class agent detection ───────────────────────────────
  app.post('/api/classify', express.json(), (req, res) => {
    const { ua, spearmanRho, variance, entropy, frankensteinScore, hasPoW, headers } = req.body ?? {};
    const result = classifyAgent({
      ua: ua ?? '',
      spearmanRho: spearmanRho ?? lastSpearmanRho,
      variance: variance ?? currentMetrics.variance,
      entropy: entropy ?? currentMetrics.entropy,
      frankensteinScore: frankensteinScore ?? 0,
      hasPoW: hasPoW ?? false,
      headers: headers ?? {},
    });
    res.json(result);
  });

  // ── /api/trust-assessment — fused, graduated trust decision ───────────────
  // Composes the existing PQC/Frankenstein/rhythm/classifier/wallet-Sybil
  // checks behind one policy (src/services/trustEngine.ts) instead of each
  // being evaluated in isolation at its own call site. Hard gates (PQC
  // session, WebDriver artifacts, Frankenstein >=100) short-circuit to DENY;
  // everything else fuses into one score with weakest-signal moderation,
  // landing in ALLOW / STEP_UP / SHADOW_LIMIT / DENY rather than a bare
  // boolean. None of the underlying checks changed — this only adds the
  // fusion layer over signals server.ts already computes elsewhere.
  app.post('/api/trust-assessment', express.json(), (req, res) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const { ua, spearmanRho, variance, entropy, hasPoW, headers, wallet, automationFingerprint } = req.body ?? {};

    const frankensteinScore = checkConsistency(req);
    const classification = classifyAgent({
      ua: ua ?? '',
      spearmanRho: spearmanRho ?? lastSpearmanRho,
      variance: variance ?? currentMetrics.variance,
      entropy: entropy ?? currentMetrics.entropy,
      frankensteinScore,
      hasPoW: hasPoW ?? false,
      headers: headers ?? {},
    });

    const automationVerdict = automationFingerprint ? detectAutomation(automationFingerprint) : null;

    const signals = [
      pqcSessionSignal(sessionKeys.has('default')),
      automationSignal(automationVerdict?.detected ?? false, automationVerdict?.reasons ?? []),
      frankensteinSignal(frankensteinScore),
      rhythmTrustSignal(rhythmManager.getTrustStatus(ip)),
      classifierSignal(classification.agentClass, classification.confidence),
    ];

    if (wallet) {
      const binding = lookupWallet(wallet);
      if (binding) {
        signals.push(walletSybilSignal(getWalletsByHash(binding.behavioralHash).length));
      }
    }

    const assessment = evaluateTrust(signals);
    res.json(assessment);
  });

  // ── /api/shadow-stats — RPC shadow filter metrics ─────────────────────────
  app.get('/api/shadow-stats', (_req, res) => {
    res.json(getShadowStats());
  });

  app.post('/api/admin/clear-shadow', (req, res) => {
    const ip = req.socket.remoteAddress ?? '';
    if (ip !== '127.0.0.1' && ip !== '::1' && ip !== '::ffff:127.0.0.1') {
      res.status(403).end(); return;
    }
    clearShadowRecords();
    res.json({ ok: true });
  });

  // ── /api/wallet/bind — on-chain wallet identity binding ───────────────────
  app.post('/api/wallet/bind', express.json(), (req, res) => {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const { wallet, signature, challenge } = req.body ?? {};

    if (!wallet || !signature || !challenge) {
      res.status(400).json({ error: 'MISSING_FIELDS', required: ['wallet', 'signature', 'challenge'] }); return;
    }

    if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
      res.status(400).json({ error: 'INVALID_WALLET_FORMAT' }); return;
    }

    if (!validateSignatureStructure(signature)) {
      res.status(400).json({ error: 'INVALID_SIGNATURE_FORMAT' }); return;
    }

    const sessionEntry = sessionKeys.get('default');
    const secret = sessionEntry?.key ?? crypto.randomBytes(32);
    const behavioralHash = computeBehavioralHash(
      secret,
      currentMetrics.entropy,
      currentMetrics.variance,
      lastSpearmanRho
    );

    const result = bindWallet(wallet, behavioralHash, clientIp);
    res.json({
      ok: true,
      wallet,
      behavioral_hash: behavioralHash.slice(0, 16) + '...',
      sybil_detected: result.sybilDetected,
      shared_wallets: result.sharedWallets,
    });
  });

  app.get('/api/wallet/lookup', (req, res) => {
    const wallet = (req.query.wallet as string) ?? '';
    if (!wallet) { res.status(400).json({ error: 'MISSING_WALLET' }); return; }
    const binding = lookupWallet(wallet);
    if (!binding) { res.status(404).json({ error: 'NOT_FOUND' }); return; }
    res.json({
      wallet: binding.wallet,
      bound_at: binding.boundAt,
      behavioral_hash: binding.behavioralHash.slice(0, 16) + '...',
    });
  });

  app.get('/api/wallet/stats', (_req, res) => {
    res.json(getBindingStats());
  });

  app.post('/api/admin/clear-wallets', (req, res) => {
    const ip = req.socket.remoteAddress ?? '';
    if (ip !== '127.0.0.1' && ip !== '::1' && ip !== '::ffff:127.0.0.1') {
      res.status(403).end(); return;
    }
    clearBindings();
    res.json({ ok: true });
  });

  // ── /api/zk — ZK-lite proof generation and redemption ────────────────────
  app.post('/api/zk/issue', (req, res) => {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const sessionEntry = sessionKeys.get('default');
    const secret = sessionEntry?.key ?? crypto.randomBytes(32);

    const pow = verifiedPoW.get(clientIp);
    const layers: LayerResult = {
      l0_pqc:          !!sessionEntry,
      l1_gpu_ua:        true,
      l2_frankenstein:  true,
      l3_spearman:      lastSpearmanRho >= (liveRules.rho ?? 0.3),
      l4_variance:      currentMetrics.variance >= 2.0 && currentMetrics.variance < 10.0,
      l5_argon2:        !!pow,
      l6_entropy:       currentMetrics.entropy > 1.0,
      l7_jitter:        currentMetrics.mode === 'SNIPER',
    };

    const proof = issueProof(secret, layers, clientIp);
    res.json({ proof, layers_passed: proof.layersBitmap.toString(2).padStart(8, '0') });
  });

  app.post('/api/zk/verify', express.json(), (req, res) => {
    const sessionEntry = sessionKeys.get('default');
    const secret = sessionEntry?.key ?? crypto.randomBytes(32);
    const proof = req.body?.proof;

    if (!proof || typeof proof.commitment !== 'string') {
      res.status(400).json({ error: 'INVALID_PROOF' }); return;
    }

    const result = redeemProof(secret, proof);
    res.json(result);
  });

  app.post('/api/admin/clear-proofs', (req, res) => {
    const ip = req.socket.remoteAddress ?? '';
    if (ip !== '127.0.0.1' && ip !== '::1' && ip !== '::ffff:127.0.0.1') {
      res.status(403).end(); return;
    }
    clearProofs();
    res.json({ ok: true });
  });

  // ── VITE DEV / PRODUCTION STATIC ──────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Silicon DNA [L0_CORE] Active  → http://localhost:${PORT}`);
    console.log(`Prometheus metrics            → http://localhost:${PORT}/metrics`);
  });
}

startServer();
