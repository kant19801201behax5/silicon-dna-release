# Casper Agentic Buildathon 2026 — Submission Checklist

## Mandatory Requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| Working prototype on Casper Testnet | ⏳ PENDING | Need to deploy oracle-contract + run pusher |
| Blockchain transactions generated | ⏳ PENDING | update() called every 60s by pusher |
| Open source GitHub repo | ⏳ PENDING | Push casper-agent/ to public repo |
| README with documentation | ✅ DONE | README.md complete |
| Demo video | ⏳ PENDING | Record pusher + agent in action |

## Judging Criteria

| Criterion | Our Score | Evidence |
|-----------|-----------|---------|
| Technical execution | ⭐⭐⭐⭐⭐ | Odra contract, 5 tests, production-grade Python |
| Innovation | ⭐⭐⭐⭐⭐ | Only oracle with 206K+ real datapoints at buildathon |
| AI/Agentic systems | ⭐⭐⭐⭐ | casper_defi_agent.py — autonomous pause/resume |
| Real-world application | ⭐⭐⭐⭐⭐ | MEV war May 31 — documented proof |
| UX/Design | ⭐⭐⭐ | CLI output clean, no frontend yet |
| Smart contract work | ⭐⭐⭐⭐ | Odra contract with 5 tests |
| Long-term plans | ⭐⭐⭐⭐⭐ | BOT Chain (8th chain), x402 native, EF grant |
| Casper ecosystem impact | ⭐⭐⭐⭐⭐ | Oracle infra for ALL Casper DeFi agents |

## Privacy Check — Nothing Private Leaks

| Item | Status |
|------|--------|
| JARVIS URL | ✅ NOT in code or README |
| JARVIS token | ✅ NOT in code or README |
| DO server IP 198.211.103.36 | ✅ NOT in casper-agent code |
| Private keys | ✅ Only in .env (gitignored) |
| Signal format with causal.r2 | ✅ REMOVED — uses public API only |
| SIGNAL_TOKEN | ✅ REMOVED — public feed needs no auth |

## What Judges See

```
PUBLIC data → public oracle contract → autonomous agent decisions
     ↓               ↓                        ↓
rtt.phoenix-ai.work  Casper Testnet     casper_defi_agent.py
(verifiable)         (on-chain proof)   (agentic behavior)
```

## Still TODO Before June 30

1. [ ] Deploy oracle-contract to Casper Testnet
2. [ ] Get testnet CSPR from faucet: testnet.cspr.live/tools/faucet
3. [ ] Run pusher for 24h (shows continuous data)
4. [ ] Record demo video (5-7 min)
5. [ ] Push to public GitHub repo
6. [ ] Update DoraHacks BUIDL with new Casper section
