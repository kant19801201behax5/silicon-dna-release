# Casper Agentic Buildathon 2026 — Submission Checklist

## Mandatory Requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| Working prototype on Casper Testnet | ✅ DONE | Active contract: hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a |
| Blockchain transactions generated | ✅ DONE | 962 confirmed update() calls (June 3 – July 6) on original contract, live updates resumed July 16 on redeployed contract |
| Open source GitHub repo | ✅ DONE | https://github.com/kant19801201behax5/silicon-dna-release |
| README with documentation | ✅ DONE | README.md complete with architecture + setup |
| Demo video | ✅ DONE | https://youtu.be/o-CQfiSfQ4o |

## Live Proof

| Item | Value |
|------|-------|
| Active contract hash | hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a |
| Active contract deployed | July 16, 2026 |
| Original contract hash | hash-5e45d42c52872f66c47e73cdf24b0ced852f9d929834e55ea6b6fa8872d8354d (June 3 – July 6, 2026) |
| Total on-chain updates | 962 (original) + ongoing (active) |
| Safety gate blocks | 3,254 (autonomous decisions) |
| Wallet | 0202494268f650725fb759e6b89bde9a44300a89a02b7d72477eff8894c857c5defb |
| Explorer | https://testnet.cspr.live |
| Dashboard | https://phoenix-zero.vercel.app |
| Public feed | https://rtt.phoenix-ai.work/api/public-feed |
| Demo video | https://youtu.be/o-CQfiSfQ4o |
| GitHub | https://github.com/kant19801201behax5/silicon-dna-release |

## Privacy Check — Nothing Private Leaks

| Item | Status |
|------|--------|
| JARVIS URL | ✅ NOT in code or README |
| JARVIS token | ✅ NOT in code or README |
| DO server IP 198.211.103.36 | ✅ NOT in any casper-agent file |
| Private keys | ✅ Only in .env (gitignored) |
| Signal format with causal.r2 | ✅ REMOVED — uses public API only |
| SIGNAL_TOKEN | ✅ REMOVED — public feed needs no auth |

## Casper Manifest Alignment

| Initiative | Our Implementation |
|---|---|
| #8 X402 Micropayments | Phoenix Zero /api/v1/safe — $0.001/call via x402 |
| #9 Quantum-Safe Cryptography | ML-KEM-768 (NIST FIPS 203) in Silicon DNA L0 |
| #5 Compliant Security Tokens | Silicon DNA Sybil detection + ERC-8004 L0 gate |
| #3 Smart Accounts for Agents | LEGIT_AGENT vs MALICIOUS_BOT 3-class classifier |

## Architecture

```
PUBLIC data → public oracle contract → autonomous agent decisions
     ↓               ↓                        ↓
rtt.phoenix-ai.work  Casper Testnet     ts-agent/agent.js
(verifiable)         (on-chain proof)   (Node.js, deployed, runs the real cycle)
```

Note: `casper-agent/pusher/casper_defi_agent.py` is a local, off-chain
demo script (3 hardcoded fake transactions, no Casper SDK, no signing)
illustrating the pause/resume concept — it is not the deployed agent
and does not itself touch the chain. The real on-chain agent is
`ts-agent/agent.js`.
