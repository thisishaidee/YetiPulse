import { apiSuccess } from "@/lib/api/responses";
import {
  handleWalletServiceError,
  resolveWalletAddressParam,
} from "@/lib/api/wallet-route";
import { fetchWalletAnalysis } from "@/services/sui/wallet.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const resolved = await resolveWalletAddressParam(params);
  if ("status" in resolved) return resolved;

  try {
    const analysis = await fetchWalletAnalysis(resolved.address);
    return apiSuccess(analysis);
  } catch (error) {
    return handleWalletServiceError(error);
  }
}
