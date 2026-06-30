"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { WalletInput } from "@/components/ui/WalletInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { WalletOverview } from "@/components/wallet/WalletOverview";
import { AIProfileCard } from "@/components/wallet/AIProfileCard";
import { ActivityChart } from "@/components/wallet/ActivityChart";
import { SafetyScore } from "@/components/wallet/SafetyScore";
import { SummaryCards } from "@/components/wallet/SummaryCards";
import { TransactionList } from "@/components/wallet/TransactionList";
import { TokenBalances } from "@/components/wallet/TokenBalances";
import { OwnedAssets } from "@/components/wallet/OwnedAssets";
import { RiskAlerts } from "@/components/wallet/RiskAlerts";
import { CriticalAlertBanner } from "@/components/wallet/CriticalAlertBanner";
import { SafetyRecommendations } from "@/components/wallet/SafetyRecommendations";
import { AIExplanations } from "@/components/wallet/AIExplanations";
import { NetworkSettings } from "@/components/wallet/NetworkSettings";
import { AccountSettings } from "@/components/wallet/AccountSettings";
import { PreferencesSettings } from "@/components/wallet/PreferencesSettings";
import { DashboardSkeleton } from "@/components/wallet/DashboardSkeleton";
import { DashPreview } from "@/components/wallet/DashPreview";
import { RiskPreview } from "@/components/wallet/RiskPreview";
import { SettingsPreview } from "@/components/wallet/SettingsPreview";
import { fetchWalletAnalysis } from "@/lib/api/client";
import { isValidSuiAddress } from "@/lib/utils";
import { DEMO_WALLET_ADDRESS } from "@/lib/sui/constants";
import type { WalletAnalysis } from "@/types/wallet";

type MobileView = "dash" | "risk" | "settings";

function resolveViewFromHash(hash: string): MobileView {
  if (hash === "#risk") return "risk";
  if (hash === "#settings") return "settings";
  return "dash";
}

function useMobileView(): MobileView {
  const [view, setView] = useState<MobileView>(() =>
    typeof window !== "undefined"
      ? resolveViewFromHash(window.location.hash)
      : "dash"
  );

  useEffect(() => {
    const sync = () => setView(resolveViewFromHash(window.location.hash));

    // Native browser-driven hash changes (typing a URL, back/forward via
    // history, or a real anchor navigation) reliably fire 'hashchange'.
    window.addEventListener("hashchange", sync);

    // Next.js's <Link> can update a hash-only URL via history.pushState
    // without dispatching a native 'hashchange' event in some transitions,
    // which is why tapping Risk/Settings sometimes did nothing until a full
    // pathname navigation (e.g. via Home) forced a remount. 'popstate' is
    // also needed so browser back/forward stays in sync even when the
    // change didn't originate from a hash-only anchor click.
    window.addEventListener("popstate", sync);

    // Belt-and-suspenders: re-check on every focus/visibility return too,
    // in case a transition updated the hash while this tab was backgrounded.
    document.addEventListener("visibilitychange", sync);

    sync();

    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return view;
}

function WalletAnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressParam = searchParams.get("address") ?? "";
  const mobileView = useMobileView();

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
    }
  }, [addressParam, loadAnalysis]);

  const handleAnalyze = useCallback(
    (address: string) => {
      router.push(`/wallet?address=${encodeURIComponent(address)}`);
    },
    [router]
  );

  // Reuses the exact same navigation path as WalletInput's own "Try Demo"
  // button — both ultimately call handleAnalyze with the same address, so
  // there's a single source of truth for what "demo" means in this app.
  const handleViewDemo = useCallback(() => {
    handleAnalyze(DEMO_WALLET_ADDRESS);
  }, [handleAnalyze]);

  const pageTitle =
    mobileView === "risk"
      ? "Safety & Alerts"
      : mobileView === "settings"
        ? "Configuration"
        : "Wallet Intelligence";

  const pageLabel =
    mobileView === "risk"
      ? "Risk Intelligence"
      : mobileView === "settings"
        ? "Settings"
        : "Dashboard";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-28 sm:px-6 sm:py-10 md:pb-10">
      <div className="mb-8 animate-on-load">
        <p className="section-label mb-2 md:hidden">{pageLabel}</p>
        <p className="section-label mb-2 hidden md:block">Dashboard</p>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {pageTitle}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Live on-chain analysis powered by official Sui RPC endpoints.
        </p>
      </div>

      <div className="mb-8 animate-on-load stagger-1">
        <WalletInput
          key={addressParam}
          onSubmit={handleAnalyze}
          initialValue={addressParam}
          isLoading={isLoading}
        />
      </div>

      {error && (
        <div className="mb-6 flex animate-slide-down items-center gap-2 rounded-xl border border-risk-high/20 bg-risk-high/5 px-4 py-3 text-sm text-risk-high">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading && <DashboardSkeleton view={mobileView} />}

      {!isLoading && analysis && (
        <div className="space-y-8">
          {/* ── Dashboard view ── */}
          <div
            id="dash"
            className={`scroll-mt-24 space-y-8 ${mobileView === "dash" ? "block" : "hidden md:block"}`}
          >
            <WalletOverview address={analysis.address} summary={analysis.summary} />
            <AIProfileCard
              explanations={analysis.explanations}
              transactionCount={analysis.summary.transactionCount}
            />
            <ActivityChart transactions={analysis.transactions} />
            <SummaryCards summary={analysis.summary} />
            <TokenBalances balances={analysis.balances} />
            <TransactionList
              transactions={analysis.transactions}
              explanations={analysis.explanations}
            />
            <OwnedAssets assets={analysis.assets} />
          </div>

          {/* ── Risk view ── */}
          <div
            id="risk"
            className={`scroll-mt-24 space-y-8 ${mobileView === "risk" ? "block" : "hidden md:block"}`}
          >
            <SafetyScore summary={analysis.summary} />
            <CriticalAlertBanner alerts={analysis.riskAlerts} />
            <RiskAlerts alerts={analysis.riskAlerts} />
            <SafetyRecommendations />
            <AIExplanations explanations={analysis.explanations} />
          </div>

          {/* ── Settings view ── */}
          <div
            id="settings"
            className={`space-y-8 ${mobileView === "settings" ? "block" : "hidden md:block"}`}
          >
            <AccountSettings
              address={analysis.address}
              transactionCount={analysis.summary.transactionCount}
            />
            <PreferencesSettings />
            <NetworkSettings />
          </div>
        </div>
      )}

      {!isLoading && !analysis && !error && (
        <div className="space-y-8">
          <div
            id="dash"
            className={`scroll-mt-24 space-y-8 ${mobileView === "dash" ? "block" : "hidden md:block"}`}
          >
            <DashPreview onViewDemo={handleViewDemo} isLoading={isLoading} />
          </div>

          <div
            id="risk"
            className={`scroll-mt-24 space-y-8 ${mobileView === "risk" ? "block" : "hidden md:block"}`}
          >
            <RiskPreview />
          </div>

          <div
            id="settings"
            className={`space-y-8 ${mobileView === "settings" ? "block" : "hidden md:block"}`}
          >
            <SettingsPreview />
          </div>
        </div>
      )}
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <LoadingSpinner size="lg" label="Loading dashboard..." brand />
        </div>
      }
    >
      <WalletAnalysisContent />
    </Suspense>
  );
}
