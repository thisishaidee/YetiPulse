import { apiError } from "@/lib/api/responses";
import {
  isWalletAddressInvalid,
  validateWalletAddress,
} from "@/lib/validators/wallet-address";
import { WalletServiceError } from "@/services/sui/wallet.service";

export async function resolveWalletAddressParam(
  params: Promise<{ address: string }>
): Promise<{ address: string } | ReturnType<typeof apiError>> {
  const { address: rawAddress } = await params;
  const decoded = decodeURIComponent(rawAddress);
  const validation = validateWalletAddress(decoded);

  if (isWalletAddressInvalid(validation)) {
    return apiError(validation.error, 400);
  }

  return { address: validation.normalized };
}

export function handleWalletServiceError(
  error: unknown
): ReturnType<typeof apiError> {
  if (error instanceof WalletServiceError) {
    const status = error.code === "INVALID_ADDRESS" ? 400 : 502;
    return apiError(error.message, status);
  }

  console.error("[wallet-api]", error);
  return apiError("An unexpected error occurred while fetching wallet data", 500);
}
