"use client";

import { useRouter } from "next/navigation";
import { WalletInput } from "@/components/ui/WalletInput";

export function LandingHero() {
  const router = useRouter();

  function handleScan(address: string) {
    router.push(`/pulse?address=${encodeURIComponent(address)}`);
  }

  return (
    <section className="relative flex min-h-[calc(100vh-64px)] items-center px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124,185,255,0.10), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-2xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-risk-low" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-gray-400">
            Sui mainnet · read-only
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-[-0.03em] text-white md:text-[52px] md:leading-[1.1]">
          What matters about this wallet
          <br />
          <span className="bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">
            right now.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-500 md:text-lg">
          Paste a Sui address. YetiPulse reads live on-chain activity and turns it into a short briefing — what changed, and what to look at next.
        </p>
        <div id="scan" className="scroll-mt-24 mt-10">
          <WalletInput size="large" onSubmit={handleScan} submitLabel="Scan" showDemo />
        </div>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.15em] text-gray-600">
          Official Sui RPC · No wallet connect · No seed phrase
        </p>
      </div>
    </section>
  );
}
