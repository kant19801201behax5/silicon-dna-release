import { describe, test, expect } from 'vitest';
import {
  parseClientHello, computeJA4, resolveTlsFp, tlsRisk, type ClientHelloInfo,
} from '../src/services/tlsFingerprint';

// ── Build a valid ClientHello byte-for-byte so parsing is checked against a
// known input (GREASE included on purpose). No external pcap/oracle needed. ──
function u16(n: number): Buffer { const b = Buffer.alloc(2); b.writeUInt16BE(n); return b; }
function buildClientHello(): Buffer {
  const ciphers = Buffer.concat([u16(0x0a0a), u16(0x1301), u16(0x1302)]); // GREASE + TLS_AES_128/256
  const csBlock = Buffer.concat([u16(ciphers.length), ciphers]);

  const sni = Buffer.concat([u16(0x0000), u16(5), Buffer.from([0, 3, 0, 0, 0])]); // server_name (present)
  const supVer = Buffer.concat([u16(0x002b), u16(5), Buffer.from([4, 0x0a, 0x0a, 0x03, 0x04])]); // GREASE + TLS1.3
  const alpnProtos = Buffer.concat([Buffer.from([2]), Buffer.from('h2'), Buffer.from([8]), Buffer.from('http/1.1')]);
  const alpn = Buffer.concat([u16(0x0010), u16(alpnProtos.length + 2), u16(alpnProtos.length), alpnProtos]);
  const sig = Buffer.concat([u16(0x000d), u16(6), u16(4), u16(0x0403), u16(0x0804)]); // 2 sig algs
  const greaseExt = Buffer.concat([u16(0x1a1a), u16(0)]);
  const exts = Buffer.concat([sni, supVer, alpn, sig, greaseExt]);
  const extBlock = Buffer.concat([u16(exts.length), exts]);

  const body = Buffer.concat([
    u16(0x0303),                 // legacy_version TLS1.2
    Buffer.alloc(32),            // random
    Buffer.from([0]),            // session id len 0
    csBlock,
    Buffer.from([1, 0]),         // compression: len1, null
    extBlock,
  ]);
  const hs = Buffer.concat([Buffer.from([0x01]), Buffer.from([0, (body.length >> 8) & 0xff, body.length & 0xff]), body]);
  const rec = Buffer.concat([Buffer.from([0x16, 0x03, 0x01]), u16(hs.length), hs]);
  return rec;
}

describe('parseClientHello', () => {
  const info = parseClientHello(buildClientHello())!;
  test('parses (not null)', () => expect(info).not.toBeNull());
  test('negotiated version = TLS1.3 from supported_versions (not legacy 1.2)', () =>
    expect(info.tlsVersion).toBe(0x0304));
  test('SNI detected', () => expect(info.sni).toBe(true));
  test('ciphers captured in wire order incl GREASE', () =>
    expect(info.ciphers).toEqual([0x0a0a, 0x1301, 0x1302]));
  test('ALPN list parsed', () => expect(info.alpn).toEqual(['h2', 'http/1.1']));
  test('signature_algorithms parsed', () => expect(info.sigAlgs).toEqual([0x0403, 0x0804]));
  test('extensions include SNI/supported_versions/ALPN/sigalg + GREASE', () =>
    expect(info.extensions).toEqual([0x0000, 0x002b, 0x0010, 0x000d, 0x1a1a]));
  test('malformed / truncated → null, never throws', () => {
    expect(parseClientHello(Buffer.from([0x16, 0x03]))).toBeNull();
    expect(parseClientHello(Buffer.from([0x99]))).toBeNull();
    expect(parseClientHello(Buffer.alloc(0))).toBeNull();
  });
});

describe('computeJA4 (FoxIO spec)', () => {
  const info = parseClientHello(buildClientHello())!;
  const ja4 = computeJA4(info, 't');
  test('shape: a_b_c', () => expect(ja4.split('_')).toHaveLength(3));
  test('JA4_a: TLS1.3 + SNI(d) + 2 ciphers + 4 exts (GREASE excluded) + h2', () => {
    // ciphers: 0x0a0a GREASE dropped → 2. exts: 5 minus GREASE 0x1a1a → 4. alpn h2 → "h2".
    expect(ja4.split('_')[0]).toBe('t13d0204h2');
  });
  test('JA4_b/_c are 12 hex chars each', () => {
    const [, b, c] = ja4.split('_');
    expect(b).toMatch(/^[0-9a-f]{12}$/);
    expect(c).toMatch(/^[0-9a-f]{12}$/);
  });
  test('deterministic', () => expect(computeJA4(info, 't')).toBe(ja4));
  test('cipher order does not change JA4_b (sorted before hashing)', () => {
    const reordered: ClientHelloInfo = { ...info, ciphers: [0x1302, 0x1301, 0x0a0a] };
    expect(computeJA4(reordered, 't').split('_')[1]).toBe(ja4.split('_')[1]);
  });
  test('no-SNI ClientHello → JA4_a marks "i"', () => {
    const noSni: ClientHelloInfo = { ...info, sni: false };
    expect(computeJA4(noSni, 't')[3]).toBe('i');
  });
});

describe('resolveTlsFp — never fabricates', () => {
  test('trusted proxy + valid x-tls-ja4 header → used', () => {
    const r = resolveTlsFp({ 'x-tls-ja4': 't13d1516h2_abc123abc123_def456def456' }, true);
    expect(r.source).toBe('front-header');
    expect(r.ja4).toContain('t13d');
  });
  test('UNtrusted peer → header ignored, ja4 null (no spoof)', () => {
    const r = resolveTlsFp({ 'x-tls-ja4': 't13d1516h2_x_y' }, false);
    expect(r.ja4).toBeNull();
    expect(r.source).toBe('none');
  });
  test('no header → null, not a fake constant', () => {
    expect(resolveTlsFp({}, true).ja4).toBeNull();
  });
  test('garbage header rejected', () => {
    expect(resolveTlsFp({ 'x-tls-ja4': 'not a ja4!!' }, true).ja4).toBeNull();
  });
});

describe('tlsRisk', () => {
  test('null fp → 0.5 neutral (honest unknown, not "looks fine")', () =>
    expect(tlsRisk({ ja4: null, source: 'none' }, 'Mozilla/5.0')).toBe(0.5));
  test('browser UA but no-SNI JA4 → high risk (inconsistent)', () =>
    expect(tlsRisk({ ja4: 't13i0204h2_a_b', source: 'front-header' }, 'Mozilla/5.0 Chrome/120')).toBeGreaterThan(0.6));
  test('normal browser JA4 → low risk', () =>
    expect(tlsRisk({ ja4: 't13d0204h2_a_b', source: 'front-header' }, 'Mozilla/5.0 Chrome/120')).toBeLessThan(0.3));
});
