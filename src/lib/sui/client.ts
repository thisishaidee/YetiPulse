import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";
import type { SuiNetwork } from "./constants";

function resolveNetwork(): SuiNetwork {
  const env = process.env.SUI_NETWORK?.toLowerCase();
  if (env === "testnet" || env === "devnet" || env === "mainnet") {
    return env;
  }
  return "mainnet";
}

function resolveRpcUrl(network: SuiNetwork): string {
  return process.env.SUI_RPC_URL ?? getJsonRpcFullnodeUrl(network);
}

let client: SuiJsonRpcClient | null = null;

export function getSuiClient(): SuiJsonRpcClient {
  if (!client) {
    const network = resolveNetwork();
    client = new SuiJsonRpcClient({
      url: resolveRpcUrl(network),
      network,
    });
  }
  return client;
}

export function getSuiNetwork(): SuiNetwork {
  return resolveNetwork();
}
