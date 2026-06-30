export interface TokenBalance {
  coinType: string;
  symbol: string;
  balance: string;
  balanceRaw: string;
  decimals: number;
  /** Current market price in USD for one unit of this token. Undefined when no price is available (unmapped token or price fetch failure) rather than 0, so callers can distinguish "priced at zero" from "not priced." */
  priceUsd?: number;
  /** balance (as a number) × priceUsd. Undefined whenever priceUsd is undefined. */
  usdValue?: number;
}

export interface WalletBalances {
  address: string;
  suiBalance: string;
  suiBalanceRaw: string;
  totalTokenTypes: number;
  balances: TokenBalance[];
  /** Sum of usdValue across all balances. Undefined when no balances have a usdValue (e.g. price API entirely unreachable). */
  totalPortfolioUsd?: number;
}

export interface OwnedAsset {
  id: string;
  objectType: string;
  category: "nft" | "object";
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface WalletAssets {
  address: string;
  assets: OwnedAsset[];
  totalCount: number;
}

export interface WalletTransactions {
  address: string;
  transactions: import("@/types/wallet").Transaction[];
  hasMore: boolean;
}
