#!/usr/bin/env python3
"""Unit tests for phoenix_userspace_sensor pure functions (no /proc, no kernel).
Run: python tests/test_phoenix_sensor.py  ->  exits non-zero on any failure.
ASCII-only output so it runs on any console (Windows cp1251, CI, Linux)."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from phoenix_userspace_sensor import (  # noqa: E402
    parse_proc_net_tcp, count_new_tcp_connects, diff_new_pids,
    systemic_risk, build_events,
)

_passed = 0
_failed = 0


def check(name, cond):
    global _passed, _failed
    if cond:
        _passed += 1
        print('  [ok]   ' + name)
    else:
        _failed += 1
        print('  [FAIL] ' + name)


# Real /proc/net/tcp sample: header + LISTEN + ESTABLISHED (egress) + SYN_SENT
PROC_TCP = (
    "  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid\n"
    "   0: 0100007F:1F90 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0\n"  # LISTEN
    "   1: 0100007F:C350 0100007F:1F90 01 00000000:00000000 00:00000000 00000000  1000\n"  # ESTABLISHED
    "   2: 0100007F:C351 5DB8D822:01BB 02 00000000:00000000 00:00000000 00000000  1000\n"  # SYN_SENT
)

print('\n-- parse_proc_net_tcp')
conns = parse_proc_net_tcp(PROC_TCP)
check('header row skipped, 3 conns parsed', len(conns) == 3)
check('state codes mapped', {c['state'] for c in conns} == {'LISTEN', 'ESTABLISHED', 'SYN_SENT'})
check('local/remote captured', conns[1]['remote'] == '0100007F:1F90')
check('empty input -> empty list', parse_proc_net_tcp('') == [])
check('malformed lines skipped', parse_proc_net_tcp('hdr\ngarbage\n') == [])

print('\n-- count_new_tcp_connects')
prev = parse_proc_net_tcp(PROC_TCP)
new_line = PROC_TCP + "   3: 0100007F:C352 08080808:01BB 01 00:0 00:0 0 1000\n"
cur = parse_proc_net_tcp(new_line)
check('one new outbound connection counted', count_new_tcp_connects(prev, cur) == 1)
check('no change -> 0', count_new_tcp_connects(prev, prev) == 0)
check('LISTEN sockets never counted',
      count_new_tcp_connects([], parse_proc_net_tcp(
          "h\n 0: 0100007F:1F90 00000000:0000 0A x x x y\n")) == 0)
check('null remote never counted',
      count_new_tcp_connects([], parse_proc_net_tcp(
          "h\n 0: 0100007F:C350 00000000:0000 02 x x x y\n")) == 0)

print('\n-- diff_new_pids')
check('new pids only, sorted', diff_new_pids({1, 2, 3}, {1, 2, 3, 7, 5}) == [5, 7])
check('no new pids -> empty', diff_new_pids({1, 2}, {1, 2}) == [])
check('vanished pids not counted', diff_new_pids({1, 2, 9}, {1, 2}) == [])

print('\n-- systemic_risk')
check('quiet system -> 0', systemic_risk(0, 0, 0, 100) == 0.0)
check('always within [0,1]', 0.0 <= systemic_risk(999, 999, 99999, 100) <= 1.0)
check('fork storm raises risk', systemic_risk(20, 0, 0, 100) >= 0.4 - 1e-9)
check('rtt stress contributes', systemic_risk(0, 0, 1000, 100) > 0.0)
check('monotonic in tcp velocity',
      systemic_risk(0, 40, 0, 100) > systemic_risk(0, 4, 0, 100))

print('\n-- build_events')
ev = build_events([11, 22], 3, 42.5, lambda p: 'cmd%d' % p, now=1000.0)
kinds = [e['type'] for e in ev]
check('2 exec + 3 tcp + 1 rtt',
      kinds.count('exec') == 2 and kinds.count('tcp_connect') == 3 and kinds.count('rtt') == 1)
check('exec carries injected cmd + pid', any(e.get('cmd') == 'cmd11' and e['pid'] == 11 for e in ev))
check('rtt event carries rtt_ms (server reads this)', any(e.get('rtt_ms') == 42.5 for e in ev))
check('no rtt -> no rtt event', all(e['type'] != 'rtt' for e in build_events([1], 0, None, lambda p: 'x')))
check('exec batch capped at 50',
      len([e for e in build_events(list(range(999)), 0, None, lambda p: 'x') if e['type'] == 'exec']) == 50)

print('\n' + '-' * 40)
print('Results: %d passed, %d failed' % (_passed, _failed))
if _failed:
    print('TESTS FAILED')
    sys.exit(1)
print('ALL TESTS PASSED')
