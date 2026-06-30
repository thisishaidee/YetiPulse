import { apiSuccess } from "@/lib/api/responses";
import {
  handleWalletServiceError,
  resolveWalletAddressParam,
} from "@/lib/api/wallet-route";
import { fetchWalletTransactionsFormatted } from "@/services/sui/transaction.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const resolved = await resolveWalletAddressParam(params);
  if ("status" in resolved) return resolved;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit") ?? 25), 1),
    50
  );

  try {
    const transactions = await fetchWalletTransactionsFormatted(
      resolved.address,
      limit
    );
    return apiSuccess(transactions);
  } catch (error) {
    return handleWalletServiceError(error);
  }
}
