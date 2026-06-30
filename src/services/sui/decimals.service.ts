import { getSuiClient } from "@/lib/sui/client";
import { SUI_COIN_TYPE } from "@/lib/sui/constants";

/**
 * SUI is the only entry hardcoded here. Its decimals (9) are fixed by the
 * Sui protocol itself, not a guess, so resolving it via RPC would just be
 * an extra round-trip for a value that's already certain.
 *
 * USDC and other tokens are deliberately NOT hardcoded by coinType. Sui
 * has multiple non-interchangeable USDC coinTypes in circulation (native
 * Circle-issued USDC vs. various bridged/wrapped variants from different
 * packages), and published documentation/examples for these addresses
 * don't agree with each other on which decimals value applies to which
 * exact address. Hardcoding a wrong address-to-decimals mapping would
 * silently produce incorrect USD values with no way to detect it —
 * worse than the cost of one extra RPC call. The live getCoinMetadata
 * lookup below is the single source of truth for every non-SUI token.
 */
const KNOWN_DECIMALS: Record<string, number> = {
  [SUI_COIN_TYPE]: 9,
};

/** decimals essentially never change for a given coinType once minted, so unlike price this cache has no TTL — a resolved value is cached for the lifetime of the server process. */
const decimalsCache = new Map<string, number>();

for (const [coinType, decimals] of Object.entries(KNOWN_DECIMALS)) {
  decimalsCache.set(coinType, decimals);
}

async function fetchDecimalsFromRpc(
  coinTypes: string[]
): Promise<Map<string, number>> {
  const result = new Map<string, number>();
  if (coinTypes.length === 0) return result;

  const client = getSuiClient();

  // getCoinMetadata is per-coinType (no batch endpoint in the Sui RPC
  // spec), so these run in parallel rather than sequentially. A failure
  // on one coinType (unmapped/malformed metadata, network error) must
  // never block resolution of the others, hence allSettled rather than
  // Promise.all.
  const settled = await Promise.allSettled(
    coinTypes.map((coinType) =>
      client
        .getCoinMetadata({ coinType })
        .then((metadata) => ({ coinType, metadata }))
    )
  );

  for (const outcome of settled) {
    if (outcome.status !== "fulfilled") continue;
    const { coinType, metadata } = outcome.value;
    if (metadata && typeof metadata.decimals === "number") {
      result.set(coinType, metadata.decimals);
      decimalsCache.set(coinType, metadata.decimals);
    }
  }

  return result;
}

/**
 * Resolves real decimal counts for a list of coinTypes, replacing the
 * previous hardcoded `9` used for every token. Resolution order per
 * coinType: known-table fast path → process cache → live RPC lookup →
 * hardcoded `9` fallback (logged) if metadata is genuinely unavailable,
 * so a single broken/exotic coinType can never break balance or
 * transaction rendering for the rest of the wallet.
 *
 * Batches every uncached coinType into one set of parallel RPC calls
 * regardless of how many are requested, mirroring the batching approach
 * already used in getTokenPricesUsd.
 */
export async function getTokenDecimals(
  coinTypes: string[]
): Promise<Map<string, number>> {
  const decimals = new Map<string, number>();
  const toFetch: string[] = [];

  for (const coinType of new Set(coinTypes)) {
    const cached = decimalsCache.get(coinType);
    if (cached !== undefined) {
      decimals.set(coinType, cached);
    } else {
      toFetch.push(coinType);
    }
  }

  if (toFetch.length > 0) {
    const fetched = await fetchDecimalsFromRpc(toFetch);
    for (const [coinType, value] of fetched) {
      decimals.set(coinType, value);
    }
  }

  return decimals;
}

/**
 * Convenience accessor that always returns a usable decimals value.
 * Falls back to 9 (the previous blanket behavior) only when a coinType
 * has no known mapping and its live RPC lookup failed or returned
 * nothing — logged so a silently-wrong decimal count doesn't go
 * unnoticed, while still never throwing and never blocking rendering.
 */
export function getDecimalsOrFallback(
  decimals: Map<string, number>,
  coinType: string,
  fallback = 9
): number {
  const value = decimals.get(coinType);
  if (value !== undefined) return value;
  console.warn(
    `No decimals metadata resolved for coinType "${coinType}"; falling back to ${fallback}. USD/balance figures for this token may be inaccurate.`
  );
  return fallback;
}
