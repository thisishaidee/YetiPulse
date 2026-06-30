import type { SuiTransactionBlockResponse } from "@mysten/sui/jsonRpc";
import type {
  RiskAlert,
  RiskLevel,
  WalletAnalysis,
  WalletSummary,
} from "@/types/wallet";
import { explainTransactionsSync } from "@/services/ai";
import type { WalletAssets, WalletBalances } from "@/types/sui";
import type { Transaction } from "@/types/wallet";
import {
  formatDate,
  formatRelativeTime,
  getCoinSymbol,
} from "./format";
import { transformTransactions } from "./transaction.transformer";
import { getTokenPricesUsd } from "@/services/price/price.service";
import { getTokenDecimals } from "../decimals.service";

function computeRiskLevel(score: number): RiskLevel {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

function computeRiskScore(transactions: Transaction[]): number {
  let score = 10;
  const failed = transactions.filter((tx) => tx.status === "failed").length;
  const swaps = transactions.filter((tx) => tx.type === "swap").length;

  score += failed * 15;
  score += Math.min(swaps * 5, 25);

  return Math.min(score, 100);
}

function buildRiskAlerts(
  transactions: Transaction[],
  rawTxs: SuiTransactionBlockResponse[]
): RiskAlert[] {
  const alerts: RiskAlert[] = [];

  const failedTxs = transactions.filter((tx) => tx.status === "failed");
  if (failedTxs.length > 0) {
    alerts.push({
      id: "failed-txs",
      level: "medium",
      title: "Failed transactions detected",
      description: `This wallet has ${failedTxs.length} failed transaction(s) in recent history. Failed transactions may indicate network issues or rejected contract calls.`,
      timestamp: failedTxs[0].timestamp,
    });
  }

  const swaps = transactions.filter((tx) => tx.type === "swap");
  if (swaps.length >= 3) {
    alerts.push({
      id: "frequent-swaps",
      level: "medium",
      title: "Frequent DEX activity",
      description: `${swaps.length} swap transactions found in recent history. This may indicate active trading behavior.`,
      timestamp: swaps[0].timestamp,
    });
  }

  const uniqueSenders = new Set(
    rawTxs
      .map((tx) => tx.transaction?.data?.sender)
      .filter(Boolean)
  );
  if (uniqueSenders.size > 5) {
    alerts.push({
      id: "many-counterparties",
      level: "low",
      title: "Multiple counterparty interactions",
      description: `Recent activity involves ${uniqueSenders.size} unique sender addresses.`,
      timestamp: transactions[0]?.timestamp ?? "Recently",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "no-risks",
      level: "low",
      title: "No significant risks detected",
      description:
        "Recent wallet activity appears normal based on available on-chain data.",
      timestamp: transactions[0]?.timestamp ?? "Recently",
    });
  }

  return alerts;
}

/**
 * Mirrors buildPriceMap's gap-filling approach, but keyed by coinType
 * rather than symbol — decimals are a property of the exact on-chain coin
 * type (getCoinMetadata is queried by coinType), not the display ticker,
 * so this must not collapse two different coinTypes that happen to share
 * a symbol into one cached value. Same reasoning as the price gap: a
 * wallet that fully divested a token won't have it in current balances,
 * but may still have historical transactions in it, so those
 * transaction-only coinTypes get resolved too.
 */
async function buildDecimalsMap(
  balances: WalletBalances,
  rawTxs: SuiTransactionBlockResponse[]
): Promise<Map<string, number>> {
  const decimals = new Map<string, number>();
  for (const b of balances.balances) {
    decimals.set(b.coinType, b.decimals);
  }

  const txCoinTypes = new Set<string>();
  for (const tx of rawTxs) {
    for (const change of tx.balanceChanges ?? []) {
      txCoinTypes.add(change.coinType);
    }
  }

  const missingCoinTypes = [...txCoinTypes].filter((c) => !decimals.has(c));

  if (missingCoinTypes.length > 0) {
    const fetched = await getTokenDecimals(missingCoinTypes);
    for (const [coinType, value] of fetched) {
      decimals.set(coinType, value);
    }
  }

  return decimals;
}

/**
 * Builds the price map used for both the portfolio total and transaction
 * usdValue. Starts from the prices already fetched for current balances,
 * then closes a real gap: a wallet that fully divested a token (now zero
 * balance) can still have historical transactions in that token, and such
 * a token wouldn't appear in `balances` at all. For exactly those
 * transaction-only symbols, this makes one additional call to
 * getTokenPricesUsd — which checks its own in-memory cache first, so in
 * the common case (every transacted token is still held) this resolves
 * to zero extra network requests, and in the gap case it's still just
 * one batched request, not one per missing symbol.
 */
async function buildPriceMap(
  balances: WalletBalances,
  rawTxs: SuiTransactionBlockResponse[]
): Promise<Map<string, number>> {
  const prices = new Map<string, number>();
  for (const b of balances.balances) {
    if (b.priceUsd !== undefined) prices.set(b.symbol.toUpperCase(), b.priceUsd);
  }

  const txSymbols = new Set<string>();
  for (const tx of rawTxs) {
    for (const change of tx.balanceChanges ?? []) {
      txSymbols.add(getCoinSymbol(change.coinType));
    }
  }

  const missingSymbols = [...txSymbols].filter(
    (s) => !prices.has(s.toUpperCase())
  );

  if (missingSymbols.length > 0) {
    const fetched = await getTokenPricesUsd(missingSymbols);
    for (const [symbol, price] of fetched) {
      prices.set(symbol.toUpperCase(), price);
    }
  }

  return prices;
}

function formatUsd(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function buildSummary(
  balances: WalletBalances,
  transactions: Transaction[],
  rawTxs: SuiTransactionBlockResponse[]
): WalletSummary {
  const timestamps = rawTxs
    .map((tx) => tx.timestampMs)
    .filter((ts): ts is string => Boolean(ts))
    .map((ts) => Number(ts))
    .sort((a, b) => a - b);

  const riskScore = computeRiskScore(transactions);

  return {
    totalBalance: balances.suiBalance,
    totalBalanceUsd:
      balances.totalPortfolioUsd !== undefined
        ? formatUsd(balances.totalPortfolioUsd)
        : "—",
    totalPortfolioUsd: balances.totalPortfolioUsd,
    transactionCount: transactions.length,
    uniqueTokens: balances.totalTokenTypes,
    firstActivity:
      timestamps.length > 0 ? formatDate(String(timestamps[0])) : "—",
    lastActivity:
      timestamps.length > 0
        ? formatRelativeTime(String(timestamps[timestamps.length - 1]))
        : "—",
    riskScore,
    riskLevel: computeRiskLevel(riskScore),
  };
}

export async function buildWalletAnalysis(
  address: string,
  balances: WalletBalances,
  rawTxs: SuiTransactionBlockResponse[],
  assets: WalletAssets
): Promise<WalletAnalysis> {
  const [prices, decimalsMap] = await Promise.all([
    buildPriceMap(balances, rawTxs),
    buildDecimalsMap(balances, rawTxs),
  ]);
  const transactions = transformTransactions(rawTxs, address, prices, decimalsMap);

  return {
    address,
    summary: buildSummary(balances, transactions, rawTxs),
    balances: balances.balances,
    transactions,
    assets: assets.assets,
    riskAlerts: buildRiskAlerts(transactions, rawTxs),
    explanations: explainTransactionsSync(rawTxs, address, 5, decimalsMap),
  };
}
