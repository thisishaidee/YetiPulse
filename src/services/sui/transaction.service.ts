import type { SuiTransactionBlockResponse } from "@mysten/sui/jsonRpc";
import { getSuiClient } from "@/lib/sui/client";
import { DEFAULT_TX_LIMIT } from "@/lib/sui/constants";
import type { WalletTransactions } from "@/types/sui";
import {
  TX_OPTIONS,
  transformTransactions,
} from "./transformers/transaction.transformer";
import { getTokenDecimals } from "./decimals.service";

export interface FetchTransactionsResult {
  raw: SuiTransactionBlockResponse[];
  hasMore: boolean;
}

async function queryTransactions(
  address: string,
  filter: { FromAddress: string } | { ToAddress: string },
  limit: number
): Promise<SuiTransactionBlockResponse[]> {
  const client = getSuiClient();
  const result = await client.queryTransactionBlocks({
    filter,
    options: TX_OPTIONS,
    order: "descending",
    limit,
  });
  return result.data;
}

function mergeTransactions(
  fromTxs: SuiTransactionBlockResponse[],
  toTxs: SuiTransactionBlockResponse[],
  limit: number
): FetchTransactionsResult {
  const byDigest = new Map<string, SuiTransactionBlockResponse>();

  for (const tx of [...fromTxs, ...toTxs]) {
    byDigest.set(tx.digest, tx);
  }

  const merged = Array.from(byDigest.values()).sort((a, b) => {
    const aTime = BigInt(a.timestampMs ?? "0");
    const bTime = BigInt(b.timestampMs ?? "0");
    if (aTime > bTime) return -1;
    if (aTime < bTime) return 1;
    return 0;
  });

  const hasMore = merged.length > limit;
  return {
    raw: merged.slice(0, limit),
    hasMore,
  };
}

export async function fetchWalletTransactions(
  address: string,
  limit = DEFAULT_TX_LIMIT
): Promise<FetchTransactionsResult> {
  const [fromTxs, toTxs] = await Promise.all([
    queryTransactions(address, { FromAddress: address }, limit),
    queryTransactions(address, { ToAddress: address }, limit),
  ]);

  return mergeTransactions(fromTxs, toTxs, limit);
}

export async function fetchWalletTransactionsFormatted(
  address: string,
  limit = DEFAULT_TX_LIMIT
): Promise<WalletTransactions> {
  const { raw, hasMore } = await fetchWalletTransactions(address, limit);

  // Decimals (unlike USD price) don't depend on having fetched balances
  // first — they're resolved directly from the coinTypes seen in these
  // transactions' own balanceChanges, so this route can have correct
  // displayed amounts without needing the wallet's current balances at
  // all. usdValue is intentionally still left unset here: pricing would
  // need a portfolio-wide price map this standalone, transactions-only
  // route has no natural source for, and inventing one would be a scope
  // expansion beyond fixing decimal handling.
  const coinTypes = new Set<string>();
  for (const tx of raw) {
    for (const change of tx.balanceChanges ?? []) {
      coinTypes.add(change.coinType);
    }
  }
  const decimalsMap = await getTokenDecimals([...coinTypes]);

  return {
    address,
    transactions: transformTransactions(raw, address, new Map(), decimalsMap),
    hasMore,
  };
}
