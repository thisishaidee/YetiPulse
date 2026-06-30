import type {
  BalanceChange,
  ObjectOwner,
  SuiTransaction,
  SuiTransactionBlockResponse,
} from "@mysten/sui/jsonRpc";
import type { Transaction } from "@/types/wallet";
import {
  formatMistAmount,
  formatRelativeTime,
  getCoinSymbol,
  rawAmountToNumber,
} from "./format";
import { getDecimalsOrFallback } from "../decimals.service";
import { truncateAddress } from "@/lib/utils";

const SWAP_PACKAGES = [
  "cetus",
  "turbos",
  "kriya",
  "flowx",
  "aftermath",
  "deepbook",
];

const TX_OPTIONS = {
  showBalanceChanges: true,
  showEffects: true,
  showInput: true,
  showObjectChanges: true,
} as const;

export { TX_OPTIONS };

function getTransactionCommands(
  tx: SuiTransactionBlockResponse
): SuiTransaction[] {
  const block = tx.transaction?.data?.transaction;
  if (!block) return [];

  if (
    block.kind === "ProgrammableTransaction" ||
    block.kind === "ProgrammableSystemTransaction"
  ) {
    return block.transactions;
  }

  return [];
}

function getAddressOwner(owner: ObjectOwner): string | null {
  if (typeof owner !== "object" || owner === null) return null;
  if ("AddressOwner" in owner) return owner.AddressOwner;
  if ("ConsensusAddressOwner" in owner) return owner.ConsensusAddressOwner.owner;
  return null;
}

function getWalletBalanceChanges(
  tx: SuiTransactionBlockResponse,
  walletAddress: string
): BalanceChange[] {
  return (tx.balanceChanges ?? []).filter((change) => {
    const owner = getAddressOwner(change.owner);
    return owner?.toLowerCase() === walletAddress.toLowerCase();
  });
}

function classifyTransaction(
  tx: SuiTransactionBlockResponse,
  walletAddress: string,
  changes: BalanceChange[]
): Transaction["type"] {
  const commands = getTransactionCommands(tx);

  const hasStake = commands.some((cmd) => {
    if ("MoveCall" in cmd) {
      const moveModule = cmd.MoveCall.module?.toLowerCase() ?? "";
      const fn = cmd.MoveCall.function?.toLowerCase() ?? "";
      return (
        moveModule.includes("sui_system") ||
        fn.includes("stake") ||
        fn.includes("request_add_stake")
      );
    }
    return false;
  });
  if (hasStake) return "stake";

  const hasSwap = commands.some((cmd) => {
    if ("MoveCall" in cmd) {
      const pkg = cmd.MoveCall.package?.toLowerCase() ?? "";
      return SWAP_PACKAGES.some((name) => pkg.includes(name));
    }
    return false;
  });
  if (hasSwap) return "swap";

  const objectChanges = tx.objectChanges ?? [];
  const hasNftChange = objectChanges.some(
    (change) =>
      (change.type === "created" || change.type === "transferred") &&
      !change.objectType?.includes("0x2::coin::Coin")
  );
  if (hasNftChange && changes.length === 0) return "nft";

  const sender = tx.transaction?.data?.sender;
  const primaryChange = changes[0];
  if (primaryChange) {
    const amount = BigInt(primaryChange.amount);
    if (amount > BigInt(0)) return "receive";
    if (amount < BigInt(0)) return "send";
  }

  if (sender?.toLowerCase() === walletAddress.toLowerCase()) return "send";
  return "receive";
}

function getCounterparty(
  tx: SuiTransactionBlockResponse,
  walletAddress: string,
  type: Transaction["type"]
): string {
  const sender = tx.transaction?.data?.sender;

  if (type === "swap") {
    const swapCmd = getTransactionCommands(tx).find((cmd) => "MoveCall" in cmd);
    if (swapCmd && "MoveCall" in swapCmd) {
      return `${swapCmd.MoveCall.module} DEX`;
    }
    return "DEX";
  }

  if (type === "stake") return "Validator Pool";

  if (sender && sender.toLowerCase() !== walletAddress.toLowerCase()) {
    return truncateAddress(sender);
  }

  const recipientChange = (tx.balanceChanges ?? []).find((change) => {
    const owner = getAddressOwner(change.owner);
    return owner && owner.toLowerCase() !== walletAddress.toLowerCase();
  });

  if (recipientChange) {
    const owner = getAddressOwner(recipientChange.owner);
    if (owner) return truncateAddress(owner);
  }

  return "—";
}

function formatAmount(change: BalanceChange, decimals: number): string {
  const amount = BigInt(change.amount);
  const formatted = formatMistAmount(
    amount < BigInt(0) ? -amount : amount,
    decimals,
    4
  );
  if (amount > BigInt(0)) return `+${formatted}`;
  if (amount < BigInt(0)) return `-${formatted}`;
  return formatted;
}

function getTransactionStatus(
  tx: SuiTransactionBlockResponse
): Transaction["status"] {
  const status = tx.effects?.status?.status;
  return status === "success" ? "success" : "failed";
}

export function transformTransaction(
  tx: SuiTransactionBlockResponse,
  walletAddress: string,
  index: number,
  prices: Map<string, number> = new Map(),
  decimalsMap: Map<string, number> = new Map()
): Transaction {
  const changes = getWalletBalanceChanges(tx, walletAddress);
  const type = classifyTransaction(tx, walletAddress, changes);
  const primaryChange = changes[0];
  const token = primaryChange
    ? getCoinSymbol(primaryChange.coinType)
    : type === "nft"
      ? "Object"
      : "SUI";

  const decimals = primaryChange
    ? getDecimalsOrFallback(decimalsMap, primaryChange.coinType)
    : 9;

  const base: Transaction = {
    id: `${tx.digest}-${index}`,
    digest: truncateAddress(tx.digest, 6, 4),
    type,
    amount: primaryChange ? formatAmount(primaryChange, decimals) : "—",
    token,
    counterparty: getCounterparty(tx, walletAddress, type),
    timestamp: formatRelativeTime(tx.timestampMs),
    status: getTransactionStatus(tx),
  };

  // usdValue is enrichment, not core transaction data: Sui's transaction
  // API has no historical price snapshot, so this always uses the current
  // market price as a fallback (the only option available), per the
  // contract documented on Transaction.usdValue. A primaryChange is
  // required since there's no token amount to value otherwise (e.g. NFT
  // transfers with no balance change); a missing price for the token
  // simply leaves usdValue undefined rather than rendering as 0.
  if (!primaryChange) return base;

  const priceUsd = prices.get(token.toUpperCase());
  if (priceUsd === undefined) return base;

  const amountAbs = (() => {
    const raw = BigInt(primaryChange.amount);
    return raw < BigInt(0) ? -raw : raw;
  })();
  const tokenAmount = rawAmountToNumber(amountAbs, decimals);

  return {
    ...base,
    usdValue: tokenAmount * priceUsd,
  };
}

/**
 * `prices` and `decimalsMap` are both optional and default to empty maps,
 * so every existing caller keeps working unchanged and simply gets
 * transactions with no usdValue and decimals falling back to the
 * previous blanket `9` (the same shape/behavior as before this feature
 * existed) — pricing and decimals are both purely additive enrichment,
 * mirroring the same defaulting pattern used in transformBalances.
 */
export function transformTransactions(
  txs: SuiTransactionBlockResponse[],
  walletAddress: string,
  prices: Map<string, number> = new Map(),
  decimalsMap: Map<string, number> = new Map()
): Transaction[] {
  return txs.map((tx, index) =>
    transformTransaction(tx, walletAddress, index, prices, decimalsMap)
  );
}
