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
  usdValue?: number;
}

export interface WalletSummary {
  totalBalance: string;
  totalBalanceUsd: string;
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

export type PulseSeverity = "urgent" | "notable" | "info";

export type PulseKind =
  | "large_transfer"
  | "new_counterparty"
  | "new_protocol"
  | "failed_burst"
  | "frequency_spike"
  | "asset_inflow"
  | (string & {});

export type PulseAction =
  | "Review transaction"
  | "Verify counterparty"
  | "Monitor"
  | (string & {});

export interface PulseBaseline {
  transactionCount: number;
  truncated?: boolean;
  windowLabel?: string;
}

export interface PulseEventEvidence {
  digest?: string;
}

export interface PulseEvent {
  id: string;
  kind: PulseKind;
  severity: PulseSeverity;
  title: string;
  body?: string;
  whatChanged?: string;
  whyUnusual?: string;
  whyItMatters?: string;
  action?: PulseAction;
  amount?: string;
  time?: string;
  evidence?: PulseEventEvidence;
}

export interface WalletPulse {
  events: PulseEvent[];
  baseline?: PulseBaseline;
}

export interface WalletAnalysis {
  address: string;
  summary: WalletSummary;
  balances: import("@/types/sui").TokenBalance[];
  transactions: Transaction[];
  assets: import("@/types/sui").OwnedAsset[];
  riskAlerts: RiskAlert[];
  explanations: AIExplanation[];
  pulse?: WalletPulse;
}
