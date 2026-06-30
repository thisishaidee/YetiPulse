import type { WalletAnalysis } from "@/types/wallet";
import {
  isWalletAddressInvalid,
  validateWalletAddress,
} from "@/lib/validators/wallet-address";
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

export async function fetchWalletAnalysis(
  address: string
): Promise<WalletAnalysis> {
  const normalized = parseWalletAddress(address);

  try {
    const [balances, { raw: transactions }, assets] = await Promise.all([
      fetchWalletBalances(normalized),
      fetchWalletTransactions(normalized),
      fetchWalletAssets(normalized),
    ]);

    return await buildWalletAnalysis(normalized, balances, transactions, assets);
  } catch (error) {
    if (error instanceof WalletServiceError) throw error;
    throw new WalletServiceError(
      "Failed to fetch wallet data from Sui network",
      "FETCH_FAILED"
    );
  }
}
