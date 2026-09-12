import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";
import type { SuiNetwork } from "./constants";

// Official public fullnodes no longer serve JSON-RPC.
const MAINNET_JSON_RPC_URL = "https://mainnet.suiet.app";

function resolveNetwork(): SuiNetwork {
  const env = process.env.SUI_NETWORK?.toLowerCase();
  if (env === "testnet" || env === "devnet" || env === "mainnet") {
    return env;
  }
  return "mainnet";
}

function resolveRpcUrl(network: SuiNetwork): string {
  if (process.env.SUI_RPC_URL) {
    return process.env.SUI_RPC_URL;
  }
  if (network === "mainnet") {
    return MAINNET_JSON_RPC_URL;
  }
  return getJsonRpcFullnodeUrl(network);
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
