import type {
  BalanceChange,
  ObjectOwner,
  SuiTransaction,
  SuiTransactionBlockResponse,
} from "@mysten/sui/jsonRpc";
import { SUI_COIN_TYPE } from "@/lib/sui/constants";

export const DEX_PACKAGE_HINTS = [
  "cetus",
  "turbos",
  "kriya",
  "flowx",
  "aftermath",
  "deepbook",
  "bluefin",
  "scallop",
] as const;

export function getAddressOwner(owner: ObjectOwner): string | null {
  if (typeof owner !== "object" || owner === null) return null;
  if ("AddressOwner" in owner) return owner.AddressOwner;
  if ("ConsensusAddressOwner" in owner) return owner.ConsensusAddressOwner.owner;
  return null;
}

export function getTransactionCommands(
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

export function getWalletBalanceChanges(
  tx: SuiTransactionBlockResponse,
  walletAddress: string
): BalanceChange[] {
  const normalized = walletAddress.toLowerCase();
  return (tx.balanceChanges ?? []).filter((change) => {
    const owner = getAddressOwner(change.owner);
    return owner?.toLowerCase() === normalized;
  });
}

export function getMoveCalls(tx: SuiTransactionBlockResponse) {
  return getTransactionCommands(tx)
    .filter((cmd): cmd is { MoveCall: NonNullable<Extract<SuiTransaction, { MoveCall: unknown }>["MoveCall"]> } =>
      "MoveCall" in cmd
    )
    .map((cmd) => cmd.MoveCall);
}

export function isDexPackage(packageId: string): boolean {
  const lower = packageId.toLowerCase();
  return DEX_PACKAGE_HINTS.some((hint) => lower.includes(hint));
}

export function isStakeCall(module: string, functionName: string): boolean {
  const mod = module.toLowerCase();
  const fn = functionName.toLowerCase();
  return (
    mod.includes("sui_system") ||
    fn.includes("stake") ||
    fn.includes("request_add_stake") ||
    fn.includes("withdraw")
  );
}

export function isCoinObjectType(objectType: string): boolean {
  return objectType.includes("0x2::coin::Coin") || objectType === SUI_COIN_TYPE;
}

export function getTransactionStatus(
  tx: SuiTransactionBlockResponse
): "success" | "failed" {
  return tx.effects?.status?.status === "success" ? "success" : "failed";
}
