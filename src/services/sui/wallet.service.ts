import type { WalletAnalysis } from "@/types/wallet";
import {
  isWalletAddressInvalid,
  validateWalletAddress,
} from "@/lib/validators/wallet-address";
import { getMainnetRpcUrls, getSuiClient, getSuiNetwork, resetSuiClient } from "@/lib/sui/client";
import { fetchWalletBalances } from "./balance.service";
import { fetchWalletTransactions } from "./transaction.service";
import { fetchWalletAssets } from "./assets.service";
import { buildWalletAnalysis } from "./transformers/analysis.transformer";

export class WalletServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "INVALID_ADDRESS" | "FETCH_FAILED"
  ) {
    super(message);
    this.name = "WalletServiceError";
  }
}

export function parseWalletAddress(address: string): string {
  const validation = validateWalletAddress(address);
  if (isWalletAddressInvalid(validation)) {
    throw new WalletServiceError(validation.error, "INVALID_ADDRESS");
  }
  return validation.normalized;
}

async function loadAnalysis(address: string): Promise<WalletAnalysis> {
  const [balances, { raw: transactions }, assets] = await Promise.all([
    fetchWalletBalances(address),
    fetchWalletTransactions(address),
    fetchWalletAssets(address),
  ]);

  return buildWalletAnalysis(address, balances, transactions, assets);
}

export async function fetchWalletAnalysis(
  address: string
): Promise<WalletAnalysis> {
  const normalized = parseWalletAddress(address);
  const urls = getSuiNetwork() === "mainnet" ? getMainnetRpcUrls() : [undefined];
  let lastError: unknown;

  for (const url of urls) {
    try {
      resetSuiClient();
      getSuiClient(url);
      return await loadAnalysis(normalized);
    } catch (error) {
      lastError = error;
      if (error instanceof WalletServiceError && error.code === "INVALID_ADDRESS") {
        throw error;
      }
    }
  }

  if (lastError instanceof WalletServiceError) throw lastError;
  throw new WalletServiceError(
    "Failed to fetch wallet data from Sui network",
    "FETCH_FAILED"
  );
}
