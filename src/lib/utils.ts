import { clsx, type ClassValue } from "clsx";
import { isValidSuiAddress as mystenIsValidSuiAddress } from "@mysten/sui/utils";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function truncateAddress(
  address: string,
  startChars = 6,
  endChars = 4
): string {
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

export function isValidSuiAddress(address: string): boolean {
  return mystenIsValidSuiAddress(address.trim());
}
