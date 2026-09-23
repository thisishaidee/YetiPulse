# YetiPulse

A quiet Sui intelligence briefing.

Paste a Sui address. YetiPulse reads live on chain activity and turns it into a short briefing: what changed, and what to look at next.

Live site: [yetipulse.netlify.app](https://yetipulse.netlify.app)

## What it is

YetiPulse is a read only wallet briefing for Sui. It does not connect a wallet, store keys, or ask for a seed phrase. You paste an address. The app reads recent chain data and shows a Pulse first, then the ledger when you want evidence.

It was started for the CLAY Hackathon (Lofi × Sui) and is now a public briefing surface for Sui mainnet.

## Journey

Landing → Enter a Sui wallet → Scan → Pulse → Evidence

## Destinations

| Route | Role |
|---|---|
| `/` | Cinematic landing: hero, Pulse preview, how it works, trust |
| `/pulse?address=` | Primary briefing |
| `/portfolio?address=` | Balances, assets, recent history |
| `/settings` | Facts only |
| `/wallet` | Redirects to `/pulse` and keeps the address |

## What Pulse shows today

Pulse v1 is honest about the window it can see:

- Live balances and USD pricing when CoinGecko answers
- A short status (Quiet or Active) from recent activity
- Last 25 transactions as a snapshot, not lifetime history
- Tokens and owned objects as supporting evidence

The typed Pulse event engine is in the codebase but unused until that engine ships. Risk alerts are not mapped into the feed.

## What it is not

- Not a wallet
- Not a connector
- Not a lifetime explorer
- Not an AI chat

## Demo wallet

The landing page includes a live demo address:

`0x1e63fee8516e1fa26016e97cc280beebb3def8e837a19be90a2504309a33aa64`

## Data sources

Official Sui public fullnodes no longer serve JSON-RPC. YetiPulse reads mainnet through public JSON-RPC providers and fails over if one endpoint dies.

Default order:

1. `https://sui.publicnode.com`
2. `https://rpc-mainnet.suiscan.xyz`
3. `https://sui-mainnet-endpoint.blockvision.org`

Set `SUI_RPC_URL` to force a provider. USD prices come from CoinGecko.

## Tech stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- `@mysten/sui` JSON-RPC client
- CoinGecko for token prices

## Environment

Create `.env.local`:

```
SUI_NETWORK=mainnet
SUI_RPC_URL=
COINGECKO_API_KEY=
```

| Variable | Required | Notes |
|---|---|---|
| `SUI_NETWORK` | No | `mainnet` / `testnet` / `devnet`. Defaults to `mainnet`. |
| `SUI_RPC_URL` | No | Overrides the first mainnet JSON-RPC URL. Fallbacks still run if that call fails. |
| `COINGECKO_API_KEY` | No | Raises CoinGecko rate limits. Pricing still works without it. |

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

| Route | Description |
|---|---|
| `GET /api/wallet/[address]` | Full briefing payload |
| `GET /api/wallet/[address]/balance` | Token balances with USD pricing |
| `GET /api/wallet/[address]/transactions` | Recent transaction snapshot |
| `GET /api/wallet/[address]/assets` | Owned objects |

## Project shape

```
src/
├── app/                 Landing, Pulse, Portfolio, Settings, API
├── components/
│   ├── landing/          Hero, preview, how it works, trust
│   ├── layout/           App shell, rail, header, footer
│   ├── pulse/            Briefing views
│   ├── ui/               Logo, scan input, primitives
│   └── wallet/           Evidence views used by Portfolio
├── lib/sui/             RPC client and constants
├── services/sui/        Chain reads and transformers
└── types/
```
