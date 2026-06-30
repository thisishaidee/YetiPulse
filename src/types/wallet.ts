export type RiskLevel = "low" | "medium" | "high";

export interface Transaction {
  id: string;
  digest: string;
  type: "send" | "receive" | "swap" | "stake" | "nft";
  amount: string;
  token: string;
  counterparty: string;
  timestamp: string;
  status: "success" | "failed";
  /** USD value of the primary balance change at the time of transformation. Uses current market price as a fallback when historical pricing isn't available (see price.service.ts) — undefined when no price could be resolved for the token. */
  usdValue?: number;
}

export interface WalletSummary {
  totalBalance: string;
  totalBalanceUsd: string;
  /** Numeric sum of all balances' usdValue, for components that need to do math/animation with the raw number rather than the formatted display string in totalBalanceUsd. Undefined when pricing was entirely unavailable. */
  totalPortfolioUsd?: number;
  transactionCount: number;
  uniqueTokens: number;
  firstActivity: string;
  lastActivity: string;
  riskScore: number;
  riskLevel: RiskLevel;
}

export interface RiskAlert {
  id: string;
  level: RiskLevel;
  title: string;
  description: string;
  timestamp: string;
}

export interface AIExplanation {
  id: string;
  transactionDigest: string;
  summary: string;
  details: string;
  tags: string[];
}

export interface WalletAnalysis {
  address: string;
  summary: WalletSummary;
  balances: import("@/types/sui").TokenBalance[];
  transactions: Transaction[];
  assets: import("@/types/sui").OwnedAsset[];
  riskAlerts: RiskAlert[];
  explanations: AIExplanation[];
}
