import { isValidSuiAddress, normalizeSuiAddress } from "@mysten/sui/utils";

export interface WalletAddressValid {
  valid: true;
  normalized: string;
}

export interface WalletAddressInvalid {
  valid: false;
  error: string;
}

export type WalletAddressValidation = WalletAddressValid | WalletAddressInvalid;

/** Type predicate so call sites narrow explicitly instead of relying on inline `!validation.valid` control-flow inference. */
export function isWalletAddressValid(
  validation: WalletAddressValidation
): validation is WalletAddressValid {
  return validation.valid === true;
}

/** Type predicate so call sites narrow explicitly instead of relying on inline `!validation.valid` control-flow inference. */
export function isWalletAddressInvalid(
  validation: WalletAddressValidation
): validation is WalletAddressInvalid {
  return validation.valid === false;
}

export function validateWalletAddress(
  address: string
): WalletAddressValidation {
  const trimmed = address.trim();

  if (!trimmed) {
    return { valid: false, error: "Wallet address is required" };
  }

  if (!isValidSuiAddress(trimmed)) {
    return {
      valid: false,
      error:
        "Invalid Sui wallet address. Must be a valid 32-byte hex address (0x...).",
    };
  }

  return { valid: true, normalized: normalizeSuiAddress(trimmed) };
}
