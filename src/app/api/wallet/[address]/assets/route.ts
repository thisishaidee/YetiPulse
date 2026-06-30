import { apiSuccess } from "@/lib/api/responses";
import {
  handleWalletServiceError,
  resolveWalletAddressParam,
} from "@/lib/api/wallet-route";
import { fetchWalletAssets } from "@/services/sui/assets.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const resolved = await resolveWalletAddressParam(params);
  if ("status" in resolved) return resolved;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit") ?? 50), 1),
    100
  );

  try {
    const assets = await fetchWalletAssets(resolved.address, limit);
    return apiSuccess(assets);
  } catch (error) {
    return handleWalletServiceError(error);
  }
}
