import type { WalletAnalysis } from "@/types/wallet";
import type { WalletAssets, WalletBalances, WalletTransactions } from "@/types/sui";

export type { ApiSuccessResponse, ApiErrorResponse } from "@/lib/api/responses";

export type WalletAnalysisResponse = WalletAnalysis;
export type WalletBalancesResponse = WalletBalances;
export type WalletTransactionsResponse = WalletTransactions;
export type WalletAssetsResponse = WalletAssets;
