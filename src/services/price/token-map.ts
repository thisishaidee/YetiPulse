/**
 * Maps token symbols (as produced by getCoinSymbol in the Sui transformers)
 * to CoinGecko coin IDs. CoinGecko's simple/price endpoint identifies coins
 * by ID, not by ticker symbol, so this table is the bridge between on-chain
 * symbols and the pricing API.
 *
 * Scoped to SUI plus the major fungible tokens most commonly held/traded
 * on Sui. Unmapped symbols simply have no price (handled gracefully by the
 * price service, not an error) — extending coverage later only means
 * adding entries here, nothing else in the pricing pipeline changes.
 */
export const SYMBOL_TO_COINGECKO_ID: Record<string, string> = {
  SUI: "sui",
  USDC: "usd-coin",
  USDT: "tether",
  WETH: "weth",
  ETH: "ethereum",
  WBTC: "wrapped-bitcoin",
  BTC: "bitcoin",
  CETUS: "cetus-protocol",
  TURBOS: "turbos-finance",
  DEEP: "deep",
  NAVX: "navi-protocol",
  WAL: "walrus-2",
  BUCK: "bucket-protocol-buck",
};

/** Stablecoins are pinned to $1 instead of round-tripping through the price API for a value that's already known and rarely worth a network call. */
export const STABLECOIN_SYMBOLS = new Set(["USDC", "USDT", "BUCK"]);

export function resolveCoinGeckoId(symbol: string): string | undefined {
  return SYMBOL_TO_COINGECKO_ID[symbol.toUpperCase()];
}
