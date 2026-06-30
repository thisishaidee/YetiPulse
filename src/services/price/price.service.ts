import { resolveCoinGeckoId, STABLECOIN_SYMBOLS } from "./token-map";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

/** How long a fetched price stays valid before a fresh fetch is attempted. Crypto prices move, but a wallet dashboard doesn't need sub-minute precision, and this keeps requests well within CoinGecko's public rate limit. */
const CACHE_TTL_MS = 60_000;

interface CacheEntry {
  priceUsd: number;
  fetchedAt: number;
}

/**
 * Module-level in-memory cache, mirroring the singleton pattern already
 * used for the Sui RPC client (see lib/sui/client.ts). This process is a
 * Next.js server, so this cache is shared across requests handled by the
 * same server instance — exactly what "cache where appropriate to avoid
 * excessive requests" calls for, with no new infra dependency.
 */
const priceCache = new Map<string, CacheEntry>();

function getCached(coingeckoId: string): number | undefined {
  const entry = priceCache.get(coingeckoId);
  if (!entry) return undefined;
  if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return undefined;
  return entry.priceUsd;
}

function setCached(coingeckoId: string, priceUsd: number): void {
  priceCache.set(coingeckoId, { priceUsd, fetchedAt: Date.now() });
}

async function fetchPricesFromCoinGecko(
  coingeckoIds: string[]
): Promise<Map<string, number>> {
  const result = new Map<string, number>();
  if (coingeckoIds.length === 0) return result;

  const idsParam = coingeckoIds.join(",");
  const url = `${COINGECKO_BASE_URL}/simple/price?ids=${encodeURIComponent(idsParam)}&vs_currencies=usd`;

  const apiKey = process.env.COINGECKO_API_KEY;
  const headers: Record<string, string> = apiKey
    ? { "x-cg-demo-api-key": apiKey }
    : {};

  try {
    const response = await fetch(url, {
      headers,
      // Short timeout via AbortSignal so a slow/hanging price API never
      // blocks wallet loading for long — pricing is enrichment, not a
      // blocking dependency.
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(`CoinGecko price fetch failed: ${response.status}`);
      return result;
    }

    const data = (await response.json()) as Record<string, { usd?: number }>;

    for (const id of coingeckoIds) {
      const price = data[id]?.usd;
      if (typeof price === "number") {
        result.set(id, price);
        setCached(id, price);
      }
    }
  } catch (error) {
    // Network failure, timeout, or malformed response. Pricing must never
    // take down wallet loading — log and return whatever we have (possibly
    // nothing), letting callers fall back to cached/zero values.
    console.error("CoinGecko price fetch error:", error);
  }

  return result;
}

/**
 * Resolves USD prices for a list of token symbols. Symbols with no known
 * CoinGecko mapping, or whose fetch fails, are simply absent from the
 * returned map — callers treat a missing entry as "no price available"
 * (priceUsd: 0) rather than as an error, so a pricing gap never breaks
 * balance/transaction rendering.
 *
 * Batches all uncached symbols into a single CoinGecko request regardless
 * of how many symbols are requested, so this scales to a large multi-asset
 * wallet without becoming N+1 requests.
 */
export async function getTokenPricesUsd(
  symbols: string[]
): Promise<Map<string, number>> {
  const prices = new Map<string, number>();
  const idsToFetch: string[] = [];
  const idToSymbols = new Map<string, string[]>();

  for (const rawSymbol of symbols) {
    const symbol = rawSymbol.toUpperCase();

    if (STABLECOIN_SYMBOLS.has(symbol)) {
      prices.set(symbol, 1);
      continue;
    }

    const coingeckoId = resolveCoinGeckoId(symbol);
    if (!coingeckoId) continue; // unmapped symbol: no price, handled by callers

    const cached = getCached(coingeckoId);
    if (cached !== undefined) {
      prices.set(symbol, cached);
      continue;
    }

    if (!idToSymbols.has(coingeckoId)) {
      idToSymbols.set(coingeckoId, []);
      idsToFetch.push(coingeckoId);
    }
    idToSymbols.get(coingeckoId)!.push(symbol);
  }

  if (idsToFetch.length > 0) {
    const fetched = await fetchPricesFromCoinGecko(idsToFetch);
    for (const [coingeckoId, price] of fetched) {
      for (const symbol of idToSymbols.get(coingeckoId) ?? []) {
        prices.set(symbol, price);
      }
    }
  }

  return prices;
}

/** Convenience accessor for a single symbol; returns 0 (never throws) when no price is available so arithmetic call sites stay simple. */
export function getPriceUsdOrZero(
  prices: Map<string, number>,
  symbol: string
): number {
  return prices.get(symbol.toUpperCase()) ?? 0;
}

export interface MarketSnapshot {
  priceUsd: number;
  change24hPercent: number;
}

interface MarketSnapshotCacheEntry {
  snapshot: MarketSnapshot;
  fetchedAt: number;
}

/**
 * Separate from priceCache above: this endpoint shape (price + 24h change
 * in one response) is different from the plain price lookup used by
 * getTokenPricesUsd, so it gets its own small cache entry rather than
 * reusing/altering the existing cache or its consumers.
 */
let suiMarketSnapshotCache: MarketSnapshotCacheEntry | undefined;

/**
 * Fetches SUI's USD price and 24h % change from CoinGecko for the
 * pre-wallet Market Snapshot card. Reuses the same base URL, API key
 * header, and 5s timeout pattern as fetchPricesFromCoinGecko above —
 * intentionally not merged into that function since it needs the
 * `include_24hr_change` param, which the existing balance-pricing path
 * doesn't need and shouldn't be made to carry.
 *
 * Returns undefined (never throws) on any failure — CoinGecko being down
 * must never crash the Dash tab; callers fall back to placeholder UI.
 */
export async function getSuiMarketSnapshot(): Promise<MarketSnapshot | undefined> {
  if (
    suiMarketSnapshotCache &&
    Date.now() - suiMarketSnapshotCache.fetchedAt <= CACHE_TTL_MS
  ) {
    return suiMarketSnapshotCache.snapshot;
  }

  const coingeckoId = resolveCoinGeckoId("SUI");
  if (!coingeckoId) return undefined; // should never happen — SUI is always mapped

  const url = `${COINGECKO_BASE_URL}/simple/price?ids=${coingeckoId}&vs_currencies=usd&include_24hr_change=true`;

  const apiKey = process.env.COINGECKO_API_KEY;
  const headers: Record<string, string> = apiKey
    ? { "x-cg-demo-api-key": apiKey }
    : {};

  try {
    const response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(`CoinGecko market snapshot fetch failed: ${response.status}`);
      return undefined;
    }

    const data = (await response.json()) as Record<
      string,
      { usd?: number; usd_24h_change?: number }
    >;

    const entry = data[coingeckoId];
    if (typeof entry?.usd !== "number") return undefined;

    const snapshot: MarketSnapshot = {
      priceUsd: entry.usd,
      change24hPercent: typeof entry.usd_24h_change === "number" ? entry.usd_24h_change : 0,
    };

    suiMarketSnapshotCache = { snapshot, fetchedAt: Date.now() };
    return snapshot;
  } catch (error) {
    console.error("CoinGecko market snapshot fetch error:", error);
    return undefined;
  }
}
