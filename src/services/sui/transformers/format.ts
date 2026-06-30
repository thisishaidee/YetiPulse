import { MIST_PER_SUI, parseStructTag } from "@mysten/sui/utils";

export function formatMistAmount(
  mist: string | bigint,
  decimals = 9,
  maxFractionDigits = 4
): string {
  const value = typeof mist === "bigint" ? mist : BigInt(mist);
  const divisor = BigInt(10) ** BigInt(decimals);
  const whole = value / divisor;
  const fraction = value % divisor;

  if (fraction === BigInt(0)) {
    return whole.toLocaleString("en-US");
  }

  const fractionStr = fraction
    .toString()
    .padStart(decimals, "0")
    .slice(0, maxFractionDigits)
    .replace(/0+$/, "");

  return `${whole.toLocaleString("en-US")}.${fractionStr}`;
}

export function formatSuiAmount(mist: string | bigint): string {
  return formatMistAmount(mist, 9, 4);
}

export function getCoinSymbol(coinType: string): string {
  try {
    const tag = parseStructTag(coinType);
    return tag.name.toUpperCase();
  } catch {
    const parts = coinType.split("::");
    return parts[parts.length - 1]?.toUpperCase() ?? "UNKNOWN";
  }
}

export function mistToNumber(mist: string): number {
  return Number(BigInt(mist)) / Number(MIST_PER_SUI);
}

/**
 * Generic version of mistToNumber for tokens that aren't SUI and may use a
 * different decimal count (e.g. USDC on Sui typically uses 6, not 9).
 * Used by the price/valuation layer, which needs precise numeric balances
 * rather than the comma-formatted display strings produced by
 * formatMistAmount. Splits the integer division so very large balances
 * don't lose precision the way `Number(bigint) / Number(bigint)` can for
 * extreme values.
 */
export function rawAmountToNumber(raw: string | bigint, decimals: number): number {
  const value = typeof raw === "bigint" ? raw : BigInt(raw);
  const divisor = BigInt(10) ** BigInt(decimals);
  const whole = value / divisor;
  const fraction = value % divisor;
  return Number(whole) + Number(fraction) / Number(divisor);
}

export function formatRelativeTime(timestampMs: string | null | undefined): string {
  if (!timestampMs) return "Unknown";

  const diff = Date.now() - Number(timestampMs);
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;

  return new Date(Number(timestampMs)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDate(timestampMs: string): string {
  return new Date(Number(timestampMs)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
