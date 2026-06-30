import type { BalanceChange } from "@mysten/sui/jsonRpc";
import { formatMistAmount, getCoinSymbol } from "@/services/sui/transformers/format";
import { getDecimalsOrFallback } from "@/services/sui/decimals.service";
import type {
  BalanceChangeSummary,
  ContractCallSummary,
  ExplanationActivity,
  ParsedTransaction,
  SwapSummary,
  TransactionExplanationInput,
} from "./types";
import {
  getMoveCalls,
  getTransactionStatus,
  getWalletBalanceChanges,
  isCoinObjectType,
  isDexPackage,
  isStakeCall,
} from "./transaction-utils";

function toBalanceSummary(
  change: BalanceChange,
  decimalsMap: Map<string, number>
): BalanceChangeSummary {
  const amount = BigInt(change.amount);
  const absAmount = amount < BigInt(0) ? -amount : amount;
  const decimals = getDecimalsOrFallback(decimalsMap, change.coinType);

  return {
    coinType: change.coinType,
    symbol: getCoinSymbol(change.coinType),
    amount: formatMistAmount(absAmount, decimals, 4),
    direction: amount > BigInt(0) ? "in" : "out",
  };
}

function detectSwap(
  changes: BalanceChangeSummary[],
  tx: TransactionExplanationInput["raw"]
): SwapSummary | undefined {
  const outgoing = changes.filter((c) => c.direction === "out");
  const incoming = changes.filter((c) => c.direction === "in");

  if (outgoing.length === 0 || incoming.length === 0) return undefined;

  const moveCalls = getMoveCalls(tx);
  const dexCall = moveCalls.find((call) => isDexPackage(call.package));

  return {
    from: outgoing[0],
    to: incoming[0],
    protocol: dexCall?.module,
  };
}

function hasNftActivity(tx: TransactionExplanationInput["raw"]): boolean {
  return (tx.objectChanges ?? []).some((change) => {
    if (change.type !== "created" && change.type !== "transferred") return false;
    return !isCoinObjectType(change.objectType);
  });
}

function hasContractCalls(tx: TransactionExplanationInput["raw"]): boolean {
  return getMoveCalls(tx).length > 0;
}

function classifyActivity(
  tx: TransactionExplanationInput["raw"],
  walletAddress: string,
  changes: BalanceChangeSummary[],
  swap?: SwapSummary
): ExplanationActivity {
  const moveCalls = getMoveCalls(tx);

  if (moveCalls.some((call) => isStakeCall(call.module, call.function))) {
    return "stake";
  }

  if (swap || moveCalls.some((call) => isDexPackage(call.package))) {
    return "swap";
  }

  if (hasNftActivity(tx) && changes.length === 0) {
    return "nft";
  }

  const primary = changes[0];
  if (primary) {
    if (primary.direction === "in") return "receive";
    if (primary.direction === "out") return "send";
  }

  if (hasContractCalls(tx)) {
    return "contract_interaction";
  }

  const sender = tx.transaction?.data?.sender;
  if (sender?.toLowerCase() === walletAddress.toLowerCase()) {
    return "send";
  }

  if (changes.length > 0) return "receive";

  return "unknown";
}

function extractContractCalls(
  tx: TransactionExplanationInput["raw"]
): ContractCallSummary[] {
  return getMoveCalls(tx).map((call) => ({
    package: call.package,
    module: call.module,
    function: call.function,
  }));
}

/** Parse raw Sui transaction RPC data into structured explanation context. */
export function parseTransaction(
  input: TransactionExplanationInput,
  decimalsMap: Map<string, number> = new Map()
): ParsedTransaction {
  const { raw, walletAddress } = input;
  const rawChanges = getWalletBalanceChanges(raw, walletAddress);
  const balanceChanges = rawChanges.map((change) =>
    toBalanceSummary(change, decimalsMap)
  );
  const swap = detectSwap(balanceChanges, raw);
  const activity = classifyActivity(raw, walletAddress, balanceChanges, swap);

  return {
    digest: raw.digest,
    walletAddress,
    activity,
    status: getTransactionStatus(raw),
    balanceChanges,
    swap,
    contractCalls: extractContractCalls(raw),
    sender: raw.transaction?.data?.sender,
    timestamp: raw.timestampMs ?? undefined,
  };
}

export function parseTransactions(
  rawTransactions: TransactionExplanationInput["raw"][],
  walletAddress: string,
  decimalsMap: Map<string, number> = new Map()
): ParsedTransaction[] {
  return rawTransactions.map((raw) =>
    parseTransaction({ raw, walletAddress }, decimalsMap)
  );
}
