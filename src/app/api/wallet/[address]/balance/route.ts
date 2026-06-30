import { apiSuccess } from "@/lib/api/responses";
import {
  handleWalletServiceError,
  resolveWalletAddressParam,
} from "@/lib/api/wallet-route";
import { fetchWalletBalances } from "@/services/sui/balance.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const resolved = await resolveWalletAddressParam(params);
  if ("status" in resolved) return resolved;

  try {
    const balances = await fetchWalletBalances(resolved.address);
    return apiSuccess(balances);
  } catch (error) {
    return handleWalletServiceError(error);
  }
}
