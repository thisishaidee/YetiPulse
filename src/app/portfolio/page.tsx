"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { useWalletAnalysis } from "@/lib/hooks/useWalletAnalysis";
import { isValidSuiAddress } from "@/lib/utils";
import { withAddress } from "@/lib/nav";
import { AddressEmpty } from "@/components/pulse/AddressEmpty";
import { PortfolioSkeleton } from "@/components/pulse/PulseSkeleton";
import { WalletIdentity } from "@/components/pulse/WalletIdentity";
import { TokenBalances } from "@/components/wallet/TokenBalances";
import { OwnedAssets } from "@/components/wallet/OwnedAssets";
import { TransactionList } from "@/components/wallet/TransactionList";

function PortfolioBody() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address") ?? "";
  const { analysis, isLoading, error, loadAnalysis } = useWalletAnalysis(address);

  return (
    <>
      <AppHeader title="Portfolio" />
      {!address ? (
        <AddressEmpty
          title="Scan a wallet first"
          description="Portfolio shows balances, assets, and recent history for a scanned address."
        />
      ) : !isValidSuiAddress(address) ? (
        <AddressEmpty title="Invalid address" description="The address in the URL is not a valid Sui address." />
      ) : isLoading ? (
        <PortfolioSkeleton />
      ) : error ? (
        <div className="mx-auto max-w-xl px-4 py-16 text-center md:px-8">
          <p className="text-sm text-risk-high">{error}</p>
          <button type="button" className="btn-secondary mt-6" onClick={() => loadAnalysis(address)}>
            Retry
          </button>
        </div>
      ) : analysis ? (
        <div className="mx-auto max-w-[1120px] space-y-10 px-4 py-8 md:px-8">
          <div className="animate-on-load flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <WalletIdentity analysis={analysis} compact />
            <Link href={withAddress("/pulse", analysis.address)} className="inline-flex min-h-11 items-center text-sm text-accent">
              Back to Pulse →
            </Link>
          </div>
          <div className="animate-on-load stagger-1">
            <TokenBalances balances={analysis.balances} />
          </div>
          <div className="animate-on-load stagger-2">
            <OwnedAssets assets={analysis.assets} />
          </div>
          <div className="animate-on-load stagger-3">
            <TransactionList transactions={analysis.transactions} explanations={analysis.explanations} />
          </div>
        </div>
      ) : (
        <AddressEmpty />
      )}
    </>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<PortfolioSkeleton />}>
      <PortfolioBody />
    </Suspense>
  );
}
