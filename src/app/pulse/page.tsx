"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { useWalletAnalysis } from "@/lib/hooks/useWalletAnalysis";
import { isValidSuiAddress } from "@/lib/utils";
import { AddressEmpty } from "@/components/pulse/AddressEmpty";
import { PulseSkeleton } from "@/components/pulse/PulseSkeleton";
import { PulseView } from "@/components/pulse/PulseView";

function PulseBody() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address") ?? "";
  const { analysis, isLoading, error, loadAnalysis } = useWalletAnalysis(address);

  return (
    <>
      <AppHeader title="Pulse" />
      {!address ? (
        <AddressEmpty />
      ) : !isValidSuiAddress(address) ? (
        <AddressEmpty
          title="Invalid address"
          description="The address in the URL is not a valid Sui address. Paste another one to scan."
        />
      ) : isLoading ? (
        <PulseSkeleton />
      ) : error ? (
        <div className="mx-auto max-w-xl px-4 py-16 text-center md:px-8">
          <p className="text-sm text-risk-high">{error}</p>
          <button type="button" className="btn-secondary mt-6" onClick={() => loadAnalysis(address)}>
            Retry
          </button>
        </div>
      ) : analysis ? (
        <PulseView analysis={analysis} />
      ) : (
        <AddressEmpty />
      )}
    </>
  );
}

export default function PulsePage() {
  return (
    <Suspense fallback={<PulseSkeleton />}>
      <PulseBody />
    </Suspense>
  );
}
