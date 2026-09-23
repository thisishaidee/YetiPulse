import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";
import type { SuiNetwork } from "./constants";

// Official public fullnodes no longer serve JSON-RPC.
const MAINNET_JSON_RPC_URLS = [
  "https://sui.publicnode.com",
  "https://rpc-mainnet.suiscan.xyz",
  "https://sui-mainnet-endpoint.blockvision.org",
] as const;

function resolveNetwork(): SuiNetwork {
  const env = process.env.SUI_NETWORK?.toLowerCase();
  if (env === "testnet" || env === "devnet" || env === "mainnet") {
    return env;
  }
  return "mainnet";
}

export function getMainnetRpcUrls(): string[] {
  const override = process.env.SUI_RPC_URL?.trim();
  const urls = override ? [override, ...MAINNET_JSON_RPC_URLS] : [...MAINNET_JSON_RPC_URLS];
  return [...new Set(urls)];
}

function resolveRpcUrl(network: SuiNetwork): string {
  if (network === "mainnet") {
    return getMainnetRpcUrls()[0];
  }
  return process.env.SUI_RPC_URL ?? getJsonRpcFullnodeUrl(network);
}

let client: SuiJsonRpcClient | null = null;
let clientUrl: string | null = null;

export function resetSuiClient() {
  client = null;
  clientUrl = null;
}

export function getSuiClient(urlOverride?: string): SuiJsonRpcClient {
  const network = resolveNetwork();
  const url = urlOverride ?? resolveRpcUrl(network);
  if (!client || clientUrl !== url) {
    client = new SuiJsonRpcClient({
      url,
      network,
    });
    clientUrl = url;
  }
  return client;
}

export function getSuiNetwork(): SuiNetwork {
  return resolveNetwork();
}
