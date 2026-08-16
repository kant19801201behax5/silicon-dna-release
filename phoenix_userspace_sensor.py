#!/usr/bin/env python3
"""
Phoenix Zero — userspace fallback sensor (L6), no bcc / eBPF required.

The original phoenix_zero_sensor.py needs bcc + kernel headers. On droplets where
bcc isn't installed (the DO NYC1 box: kernel 5.15, bcc absent) L6 produced zero
events — a headline layer sitting dead. This sensor gives L6 *real* data using
only /proc + the Python stdlib: process-exec velocity, outbound TCP-connect
velocity, and live RTT to a reference host. It POSTs batches to Silicon DNA's
localhost-only ingestion (/api/agent/interact), the same endpoint the eBPF sensor
targets, so nothing downstream changes.

Pure functions (parse_proc_net_tcp / count_new_tcp_connects / diff_new_pids /
systemic_risk) are separated from the /proc collectors so they can be unit-tested
on any OS without a kernel — see tests/test_phoenix_sensor.py.
"""
import os
import time
import json
import socket
import urllib.request

SILICON_URL = os.environ.get('SILICON_URL', 'http://127.0.0.1:3001/api/agent/interact')
POLL_SEC = float(os.environ.get('POLL_SEC', '2.0'))
RTT_HOST = os.environ.get('RTT_TARGET_HOST', 'mainnet.base.org')
RTT_PORT = int(os.environ.get('RTT_TARGET_PORT', '443'))
MAX_EVENTS = 50  # cap batch size so a fork storm can't balloon the POST body

# Linux /proc/net/tcp state codes (hex) → names
TCP_STATES = {
    '01': 'ESTABLISHED', '02': 'SYN_SENT', '03': 'SYN_RECV', '04': 'FIN_WAIT1',
    '05': 'FIN_WAIT2', '06': 'TIME_WAIT', '07': 'CLOSE', '08': 'CLOSE_WAIT',
    '09': 'LAST_ACK', '0A': 'LISTEN', '0B': 'CLOSING',
}
_OUTBOUND_STATES = ('SYN_SENT', 'ESTABLISHED')
_NULL_REMOTE = ('00000000:0000', '00000000000000000000000000000000:0000')


# ── pure functions (unit-tested, OS-agnostic) ────────────────────────────────

def parse_proc_net_tcp(text):
    """Parse /proc/net/tcp or /proc/net/tcp6 content into connection dicts.
    Skips the header row and any malformed lines."""
    out = []
    for line in text.splitlines()[1:]:
        parts = line.split()
        if len(parts) < 4:
            continue
        st = parts[3].upper()
        out.append({'local': parts[1], 'remote': parts[2],
                    'state': TCP_STATES.get(st, st)})
    return out


def count_new_tcp_connects(prev, cur):
    """Outbound connections present in `cur` but not `prev` — a connect-velocity
    proxy. Ignores null/listening remotes so only real egress counts."""
    prev_keys = {(c['local'], c['remote']) for c in prev}
    n = 0
    for c in cur:
        key = (c['local'], c['remote'])
        if key in prev_keys:
            continue
        if c['state'] in _OUTBOUND_STATES and c['remote'] not in _NULL_REMOTE:
            n += 1
    return n


def diff_new_pids(prev_set, cur_set):
    """PIDs in cur_set not in prev_set — an exec/spawn proxy. Sorted for determinism."""
    return sorted(cur_set - prev_set)


def systemic_risk(exec_count, tcp_count, rtt_ms, rtt_baseline):
    """Fuse exec velocity + tcp velocity + RTT stress into [0,1].
    Deliberately interpretable threshold weighting, not an ML model."""
    e = min(1.0, exec_count / 20.0)          # 20 new procs / cycle == max
    t = min(1.0, tcp_count / 40.0)           # 40 new conns / cycle == max
    denom = max(rtt_baseline * 2.0, 200.0)
    r = min(1.0, rtt_ms / denom) if rtt_ms else 0.0
    return round(min(1.0, 0.4 * e + 0.4 * t + 0.2 * r), 4)


def build_events(new_pids, new_tcp, rtt_ms, pid_cmd_fn, now=None):
    """Shape raw counts into the event list Silicon DNA's ingestion expects.
    `pid_cmd_fn(pid) -> str` is injected so this stays pure/testable."""
    ts = now if now is not None else time.time()
    events = []
    for pid in new_pids[:MAX_EVENTS]:
        events.append({'type': 'exec', 'pid': pid, 'cmd': pid_cmd_fn(pid), 'ts': ts})
    for _ in range(min(new_tcp, MAX_EVENTS)):
        events.append({'type': 'tcp_connect', 'ts': ts})
    if rtt_ms is not None:
        events.append({'type': 'rtt', 'rtt_ms': rtt_ms, 'ts': ts})
    return events


# ── /proc collectors (Linux runtime only) ────────────────────────────────────

def read_pids():
    return {int(p) for p in os.listdir('/proc') if p.isdigit()}


def read_tcp():
    conns = []
    for f in ('/proc/net/tcp', '/proc/net/tcp6'):
        try:
            with open(f) as fh:
                conns += parse_proc_net_tcp(fh.read())
        except OSError:
            pass
    return conns


def pid_cmd(pid):
    try:
        with open('/proc/%d/comm' % pid) as f:
            return f.read().strip()[:64]
    except OSError:
        return '?'


def measure_rtt(host, port):
    t0 = time.time()
    try:
        s = socket.create_connection((host, port), timeout=3)
        s.close()
        return round((time.time() - t0) * 1000, 1)
    except OSError:
        return None


def post(events, systemic):
    body = json.dumps({
        'agent_id': 'phoenix-userspace',
        'data_type': 'telemetry',
        'payload': {'events': events, 'systemic_risk': systemic},
    }).encode()
    req = urllib.request.Request(SILICON_URL, data=body,
                                 headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=5) as r:
        return r.status


def main():
    print('[phoenix-userspace] L6 sensor starting → %s (poll %ss, rtt %s:%d)'
          % (SILICON_URL, POLL_SEC, RTT_HOST, RTT_PORT))
    prev_pids = read_pids()
    prev_tcp = read_tcp()
    rtt_ema = 0.0
    while True:
        time.sleep(POLL_SEC)
        try:
            cur_pids = read_pids()
            cur_tcp = read_tcp()
            new_pids = diff_new_pids(prev_pids, cur_pids)
            new_tcp = count_new_tcp_connects(prev_tcp, cur_tcp)
            rtt = measure_rtt(RTT_HOST, RTT_PORT)
            if rtt is not None:
                rtt_ema = rtt if rtt_ema == 0 else rtt_ema * 0.9 + rtt * 0.1
            events = build_events(new_pids, new_tcp, rtt, pid_cmd)
            risk = systemic_risk(len(new_pids), new_tcp, rtt or 0.0, rtt_ema or 100.0)
            if events:
                try:
                    post(events, risk)
                except Exception as e:  # noqa: BLE001 — never let a POST error kill the loop
                    print('[phoenix-userspace] post error: %s' % e)
            prev_pids, prev_tcp = cur_pids, cur_tcp
        except Exception as e:  # noqa: BLE001
            print('[phoenix-userspace] loop error: %s' % e)


if __name__ == '__main__':
    main()
