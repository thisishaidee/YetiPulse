import type { SuiTransactionBlockResponse } from "@mysten/sui/jsonRpc";

export type ExplanationActivity =
  | "receive"
  | "send"
  | "swap"
  | "stake"
  | "nft"
  | "contract_interaction"
  | "unknown";

export interface BalanceChangeSummary {
  coinType: string;
  symbol: string;
  amount: string;
  direction: "in" | "out";
}

export interface SwapSummary {
  from: BalanceChangeSummary;
  to: BalanceChangeSummary;
  protocol?: string;
}

export interface ContractCallSummary {
  package: string;
  module: string;
  function: string;
}

/** Structured context extracted from raw Sui RPC transaction data. */
export interface ParsedTransaction {
  digest: string;
  walletAddress: string;
  activity: ExplanationActivity;
  status: "success" | "failed";
  balanceChanges: BalanceChangeSummary[];
  swap?: SwapSummary;
  contractCalls: ContractCallSummary[];
  sender?: string;
  timestamp?: string;
}

export interface TransactionExplanationInput {
  raw: SuiTransactionBlockResponse;
  walletAddress: string;
}

/** Human-readable output from the explanation engine. */
export interface ExplanationResult {
  summary: string;
  details: string;
  tags: string[];
  activity: ExplanationActivity;
}

export type ExplanationProvider = (
  parsed: ParsedTransaction
) => ExplanationResult | Promise<ExplanationResult>;
