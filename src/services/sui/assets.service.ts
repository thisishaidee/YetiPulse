import { getSuiClient } from "@/lib/sui/client";
import { DEFAULT_ASSETS_LIMIT } from "@/lib/sui/constants";
import type { WalletAssets } from "@/types/sui";
import { transformOwnedObjects } from "./transformers/assets.transformer";

export async function fetchWalletAssets(
  address: string,
  limit = DEFAULT_ASSETS_LIMIT
): Promise<WalletAssets> {
  const client = getSuiClient();

  const result = await client.getOwnedObjects({
    owner: address,
    options: {
      showType: true,
      showContent: true,
      showDisplay: true,
    },
    limit,
  });

  const assets = transformOwnedObjects(result.data);

  return {
    address,
    assets,
    totalCount: assets.length,
  };
}
