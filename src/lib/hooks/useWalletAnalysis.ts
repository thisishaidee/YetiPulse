"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchWalletAnalysis } from "@/lib/api/client";
import { isValidSuiAddress } from "@/lib/utils";
import type { WalletAnalysis } from "@/types/wallet";

export function useWalletAnalysis(addressParam: string) {
  const [analysis, setAnalysis] = useState<WalletAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalysis = useCallback(async (address: string) => {
    setIsLoading(true);
    setError(null);
    try {
      setAnalysis(await fetchWalletAnalysis(address));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load wallet data");
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (addressParam && isValidSuiAddress(addressParam)) {
      loadAnalysis(addressParam);
    } else if (addressParam) {
      setError("Invalid Sui wallet address in URL");
      setAnalysis(null);
    } else {
      setAnalysis(null);
      setError(null);
      setIsLoading(false);
    }
  }, [addressParam, loadAnalysis]);

  return { analysis, isLoading, error, loadAnalysis };
}
