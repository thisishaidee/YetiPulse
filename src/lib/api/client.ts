import type { ApiErrorResponse, ApiSuccessResponse } from "@/lib/api/responses";
import type { AIExplanation } from "@/types/wallet";
import type {
  WalletAnalysisResponse,
  WalletAssetsResponse,
  WalletBalancesResponse,
  WalletTransactionsResponse,
} from "@/types/api";
import type { ExplanationResult } from "@/services/ai";
import type { SuiTransactionBlockResponse } from "@mysten/sui/jsonRpc";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const json = (await response.json()) as
    | ApiSuccessResponse<T>
    | ApiErrorResponse;

  if (!response.ok || !json.success) {
    const message =
      "error" in json ? json.error : "Request failed";
    throw new ApiClientError(message, response.status);
  }

  return json.data;
}

function encodeAddress(address: string): string {
  return encodeURIComponent(address);
}

export async function fetchWalletAnalysis(
  address: string
): Promise<WalletAnalysisResponse> {
  const response = await fetch(`/api/wallet/${encodeAddress(address)}`);
  return parseResponse<WalletAnalysisResponse>(response);
}

export async function fetchWalletBalances(
  address: string
): Promise<WalletBalancesResponse> {
  const response = await fetch(
    `/api/wallet/${encodeAddress(address)}/balance`
  );
  return parseResponse<WalletBalancesResponse>(response);
}

export async function fetchWalletTransactions(
  address: string,
  limit = 25
): Promise<WalletTransactionsResponse> {
  const response = await fetch(
    `/api/wallet/${encodeAddress(address)}/transactions?limit=${limit}`
  );
  return parseResponse<WalletTransactionsResponse>(response);
}

export async function fetchWalletAssets(
  address: string,
  limit = 50
): Promise<WalletAssetsResponse> {
  const response = await fetch(
    `/api/wallet/${encodeAddress(address)}/assets?limit=${limit}`
  );
  return parseResponse<WalletAssetsResponse>(response);
}

export interface SuiMarketSnapshot {
  priceUsd: number;
  change24hPercent: number;
}

export async function fetchSuiMarketSnapshot(): Promise<SuiMarketSnapshot> {
  const response = await fetch("/api/market/sui");
  return parseResponse<SuiMarketSnapshot>(response);
}

export async function explainTransactions(
  walletAddress: string,
  transactions: SuiTransactionBlockResponse[],
  limit = 5
): Promise<AIExplanation[]> {
  const response = await fetch("/api/ai/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, transactions, limit }),
  });
  const data = await parseResponse<{ explanations: AIExplanation[] }>(
    response
  );
  return data.explanations;
}

export async function explainTransaction(
  walletAddress: string,
  transaction: SuiTransactionBlockResponse
): Promise<ExplanationResult & { digest: string }> {
  const response = await fetch("/api/ai/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, transaction }),
  });
  return parseResponse<ExplanationResult & { digest: string }>(response);
}
