# YetiPulse

Understand Sui blockchain wallet activity in plain English.

## Overview

YetiPulse is a wallet intelligence dashboard built on Sui. It analyzes live wallet activity, detects risk behavior, tracks assets, and generates AI-powered explanations for wallet actions.

Built for the **CLAY Hackathon (Lofi × Sui)**.

## Features

- Live Sui wallet analysis
- Wallet risk scoring
- AI-generated wallet behavior explanations
- Transaction categorization (Swaps, Transfers, NFTs, Stake)
- Owned asset / NFT tracking
- Real-time token balances
- Risk alerts & safety recommendations
- Sui mainnet RPC integration
- CoinGecko USD pricing integration
- Responsive mobile + desktop dashboard

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Sui TypeScript SDK (`@mysten/sui`)
- CoinGecko API

## Environment Variables

Create `.env.local` in the project root:

```
SUI_NETWORK=mainnet
SUI_RPC_URL=
COINGECKO_API_KEY=YOUR_API_KEY_HERE
```

| Variable | Required | Notes |
|---|---|---|
| `SUI_NETWORK` | Soft-required | `mainnet` / `testnet` / `devnet`. Defaults to `mainnet` if unset. |
| `SUI_RPC_URL` | Optional | Falls back to the official Sui public fullnode if omitted. |
| `COINGECKO_API_KEY` | Optional | Recommended for production — raises CoinGecko rate limits. Free key available at [coingecko.com/en/developers/dashboard](https://www.coingecko.com/en/developers/dashboard). |

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, feature overview, wallet input |
| `/wallet` | Wallet analytics dashboard |

## API Routes

| Route | Description |
|---|---|
| `GET /api/wallet/[address]` | Full wallet analysis |
| `GET /api/wallet/[address]/balance` | Token balances with USD pricing |
| `GET /api/wallet/[address]/transactions` | Transaction history |
| `GET /api/wallet/[address]/assets` | Owned NFTs & on-chain objects |

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                   # Landing page
│   ├── wallet/
│   │   └── page.tsx               # Wallet dashboard
│   └── api/
│       ├── wallet/[address]/      # Wallet analysis route
│       │   ├── route.ts
│       │   ├── balance/route.ts
│       │   ├── transactions/route.ts
│       │   └── assets/route.ts
│       └── ai/explain/route.ts    # AI explanation route
├── components/
│   ├── landing/                   # Landing page sections
│   ├── layout/                    # Header, BottomNav
│   ├── ui/                        # Shared primitives (Skeleton, SectionHeader, etc.)
│   └── wallet/                    # Dashboard components
│       ├── WalletOverview.tsx
│       ├── AIProfileCard.tsx
│       ├── ActivityChart.tsx
│       ├── SummaryCards.tsx
│       ├── TokenBalances.tsx
│       ├── TransactionList.tsx
│       ├── OwnedAssets.tsx
│       ├── SafetyScore.tsx
│       ├── RiskAlerts.tsx
│       ├── CriticalAlertBanner.tsx
│       ├── SafetyRecommendations.tsx
│       ├── AIExplanations.tsx
│       ├── AccountSettings.tsx
│       ├── PreferencesSettings.tsx
│       ├── NetworkSettings.tsx
│       └── DashboardSkeleton.tsx
├── lib/
│   ├── api/                       # API client + route helpers
│   ├── hooks/                     # React hooks
│   ├── sui/                       # Sui client + constants
│   ├── utils.ts
│   └── validators/
├── services/
│   ├── ai/                        # AI explanation engine
│   ├── price/                     # CoinGecko USD pricing
│   └── sui/                       # Sui data services + transformers
└── types/
    ├── wallet.ts
    └── api.ts
```

## Submission Notes

Built for **CLAY Hackathon 2026**.

Focus: wallet intelligence, behavioral analysis, and accessible on-chain transparency for the Sui ecosystem.
