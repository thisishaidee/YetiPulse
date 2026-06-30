import type { SuiTransactionBlockResponse } from "@mysten/sui/jsonRpc";
import type { AIExplanation } from "@/types/wallet";
import { truncateAddress } from "@/lib/utils";
import { formatRelativeTime } from "@/services/sui/transformers/format";
import { parseTransaction, parseTransactions } from "./parse-transaction";
import { generatePlaceholderExplanation } from "./templates";
import type {
  ExplanationProvider,
  ExplanationResult,
  ParsedTransaction,
  TransactionExplanationInput,
} from "./types";

const DEFAULT_PROVIDER: ExplanationProvider = generatePlaceholderExplanation;

/**
 * Generate a human-readable explanation for a single parsed transaction.
 * Uses the configured provider (placeholder templates by default).
 */
export async function explainParsedTransaction(
  parsed: ParsedTransaction,
  provider: ExplanationProvider = DEFAULT_PROVIDER
): Promise<ExplanationResult & { digest: string }> {
  const result = await provider(parsed);
  return { ...result, digest: parsed.digest };
}

/**
 * Generate a human-readable explanation from raw Sui transaction data.
 */
export async function explainTransaction(
  input: TransactionExplanationInput,
  provider: ExplanationProvider = DEFAULT_PROVIDER,
  decimalsMap: Map<string, number> = new Map()
): Promise<ExplanationResult & { digest: string }> {
  const parsed = parseTransaction(input, decimalsMap);
  return explainParsedTransaction(parsed, provider);
}

/**
 * Batch-explain raw transactions and map to dashboard AIExplanation cards.
 */
export async function explainTransactions(
  rawTransactions: SuiTransactionBlockResponse[],
  walletAddress: string,
  options: {
    limit?: number;
    provider?: ExplanationProvider;
    decimalsMap?: Map<string, number>;
  } = {}
): Promise<AIExplanation[]> {
  const { limit = 5, provider = DEFAULT_PROVIDER, decimalsMap = new Map() } = options;
  const parsedList = parseTransactions(
    rawTransactions.slice(0, limit),
    walletAddress,
    decimalsMap
  );

  const explanations = await Promise.all(
    parsedList.map((parsed, index) =>
      explainParsedTransaction(parsed, provider).then((result) => ({
        id: `explanation-${parsed.digest}-${index}`,
        transactionDigest: truncateAddress(parsed.digest, 6, 4),
        summary: result.summary,
        details: result.details,
        tags: result.tags,
      }))
    )
  );

  return explanations;
}

/** Synchronous shortcut using placeholder templates only. */
export function explainTransactionSync(
  input: TransactionExplanationInput,
  decimalsMap: Map<string, number> = new Map()
): ExplanationResult & { digest: string } {
  const parsed = parseTransaction(input, decimalsMap);
  const result = generatePlaceholderExplanation(parsed);
  return { ...result, digest: parsed.digest };
}

export function explainTransactionsSync(
  rawTransactions: SuiTransactionBlockResponse[],
  walletAddress: string,
  limit = 5,
  decimalsMap: Map<string, number> = new Map()
): AIExplanation[] {
  return parseTransactions(
    rawTransactions.slice(0, limit),
    walletAddress,
    decimalsMap
  ).map((parsed, index) => {
    const result = generatePlaceholderExplanation(parsed);
    return {
      id: `explanation-${parsed.digest}-${index}`,
      transactionDigest: truncateAddress(parsed.digest, 6, 4),
      summary: result.summary,
      details: result.details,
      tags: result.tags,
    };
  });
}

/** Re-export parser for consumers that need structured context before explaining. */
export { parseTransaction, parseTransactions };

/** Format a one-line summary without full explanation (utility for tables/tooltips). */
export function formatTransactionSummary(
  input: TransactionExplanationInput
): string {
  return explainTransactionSync(input).summary;
}

export function formatRelativeTimestamp(timestampMs?: string): string {
  return timestampMs ? formatRelativeTime(timestampMs) : "Unknown";
}
