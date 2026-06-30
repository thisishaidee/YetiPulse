import type { SuiTransactionBlockResponse } from "@mysten/sui/jsonRpc";
import { apiError, apiSuccess } from "@/lib/api/responses";
import {
  isWalletAddressInvalid,
  validateWalletAddress,
} from "@/lib/validators/wallet-address";
import {
  explainTransactionSync,
  explainTransactionsSync,
} from "@/services/ai";
import { getTokenDecimals } from "@/services/sui/decimals.service";

interface ExplainRequestBody {
  walletAddress: string;
  transaction?: SuiTransactionBlockResponse;
  transactions?: SuiTransactionBlockResponse[];
  limit?: number;
}

function collectCoinTypes(txs: SuiTransactionBlockResponse[]): string[] {
  const coinTypes = new Set<string>();
  for (const tx of txs) {
    for (const change of tx.balanceChanges ?? []) {
      coinTypes.add(change.coinType);
    }
  }
  return [...coinTypes];
}

export async function POST(request: Request) {
  let body: ExplainRequestBody;

  try {
    body = (await request.json()) as ExplainRequestBody;
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  const validation = validateWalletAddress(body.walletAddress ?? "");
  if (isWalletAddressInvalid(validation)) {
    return apiError(validation.error, 400);
  }

  const walletAddress = validation.normalized;

  if (body.transaction) {
    // This route receives already-fetched raw transaction JSON directly in
    // the request body rather than fetching it from the Sui RPC itself, so
    // it has no balance data to derive decimals from for free the way the
    // combined wallet-analysis flow does — it resolves them itself here.
    const decimalsMap = await getTokenDecimals(collectCoinTypes([body.transaction]));
    const explanation = explainTransactionSync(
      { raw: body.transaction, walletAddress },
      decimalsMap
    );
    return apiSuccess(explanation);
  }

  if (body.transactions && body.transactions.length > 0) {
    const limit = Math.min(Math.max(body.limit ?? 5, 1), 25);
    const decimalsMap = await getTokenDecimals(collectCoinTypes(body.transactions));
    const explanations = explainTransactionsSync(
      body.transactions,
      walletAddress,
      limit,
      decimalsMap
    );
    return apiSuccess({ explanations });
  }

  return apiError(
    "Provide either `transaction` or `transactions` in the request body",
    400
  );
}
