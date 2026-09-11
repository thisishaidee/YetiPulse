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
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return minutes === 1 ? "1 min ago" : `${minutes} min ago`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  if (seconds < 2592000) {
    const weeks = Math.floor(seconds / 604800);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }

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
