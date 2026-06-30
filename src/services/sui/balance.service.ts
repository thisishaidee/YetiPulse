import { getSuiClient } from "@/lib/sui/client";
import type { WalletBalances } from "@/types/sui";
import { transformBalances } from "./transformers/balance.transformer";
import { getCoinSymbol } from "./transformers/format";
import { getTokenPricesUsd } from "@/services/price/price.service";
import { getTokenDecimals } from "./decimals.service";

export async function fetchWalletBalances(
  address: string
): Promise<WalletBalances> {
  const client = getSuiClient();
  const coinBalances = await client.getAllBalances({ owner: address });

  // Pricing only needs the distinct symbols present in this wallet's
  // balances, fetched once in a single batched request regardless of how
  // many coin types are held. Uses the same getCoinSymbol parsing the
  // transformer uses, so price-map keys always match the symbols balances
  // are keyed by. Decimals are resolved the same way, but keyed by
  // coinType (not symbol) since that's what getCoinMetadata is queried
  // by and what actually determines a coin's real decimal count. Both
  // run in parallel since neither depends on the other's result.
  const [prices, decimalsMap] = await Promise.all([
    getTokenPricesUsd(coinBalances.map((c) => getCoinSymbol(c.coinType))),
    getTokenDecimals(coinBalances.map((c) => c.coinType)),
  ]);

  return transformBalances(address, coinBalances, prices, decimalsMap);
}
