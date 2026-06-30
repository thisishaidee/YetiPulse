import { apiError, apiSuccess } from "@/lib/api/responses";
import { getSuiMarketSnapshot } from "@/services/price/price.service";

/**
 * Exposes the existing CoinGecko-backed price service to client
 * components (price.service.ts is server-only — it reads
 * process.env.COINGECKO_API_KEY — so the Dash pre-wallet Market Snapshot
 * card needs a route like this rather than importing the service
 * directly). No new pricing logic lives here; this just forwards the
 * service's result.
 */
export async function GET() {
  const snapshot = await getSuiMarketSnapshot();

  if (!snapshot) {
    return apiError("Market data temporarily unavailable", 503);
  }

  return apiSuccess(snapshot);
}
