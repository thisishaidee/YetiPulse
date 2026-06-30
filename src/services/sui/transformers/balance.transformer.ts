import type { CoinBalance } from "@mysten/sui/jsonRpc";
import type { WalletBalances, TokenBalance } from "@/types/sui";
import { SUI_COIN_TYPE } from "@/lib/sui/constants";
import {
  formatMistAmount,
  formatSuiAmount,
  getCoinSymbol,
  rawAmountToNumber,
} from "./format";
import { getDecimalsOrFallback } from "../decimals.service";

function transformCoinBalance(
  coin: CoinBalance,
  prices: Map<string, number>,
  decimalsMap: Map<string, number>
): TokenBalance {
  const decimals = getDecimalsOrFallback(decimalsMap, coin.coinType);
  const symbol = getCoinSymbol(coin.coinType);
  const priceUsd = prices.get(symbol.toUpperCase());

  const base: TokenBalance = {
    coinType: coin.coinType,
    symbol,
    balance: formatMistAmount(coin.totalBalance, decimals),
    balanceRaw: coin.totalBalance,
    decimals,
  };

  if (priceUsd === undefined) return base;

  const balanceNumber = rawAmountToNumber(coin.totalBalance, decimals);
  return {
    ...base,
    priceUsd,
    usdValue: balanceNumber * priceUsd,
  };
}

/**
 * `prices` and `decimalsMap` are both optional and default to empty maps,
 * so every existing caller of transformBalances keeps working unchanged.
 * With no decimals resolved, getDecimalsOrFallback falls back to the
 * previous blanket `9` behavior (logged) rather than throwing — pricing
 * and decimals are both purely additive enrichment layered on top of the
 * balance-fetching logic, never a requirement for it to function.
 */
export function transformBalances(
  address: string,
  coinBalances: CoinBalance[],
  prices: Map<string, number> = new Map(),
  decimalsMap: Map<string, number> = new Map()
): WalletBalances {
  const balances = coinBalances.map((coin) =>
    transformCoinBalance(coin, prices, decimalsMap)
  );
  const sui = balances.find((b) => b.coinType === SUI_COIN_TYPE);

  const pricedBalances = balances.filter((b) => b.usdValue !== undefined);
  const totalPortfolioUsd =
    pricedBalances.length > 0
      ? pricedBalances.reduce((sum, b) => sum + (b.usdValue ?? 0), 0)
      : undefined;

  return {
    address,
    suiBalance: sui ? sui.balance : "0",
    suiBalanceRaw: sui?.balanceRaw ?? "0",
    totalTokenTypes: balances.length,
    balances,
    totalPortfolioUsd,
  };
}

export function getSuiBalanceFormatted(coinBalances: CoinBalance[]): string {
  const sui = coinBalances.find((c) => c.coinType === SUI_COIN_TYPE);
  return sui ? formatSuiAmount(sui.totalBalance) : "0";
}
