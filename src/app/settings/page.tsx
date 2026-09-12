"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { truncateAddress } from "@/lib/utils";
import { withAddress } from "@/lib/nav";

function SettingsBody() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  return (
    <>
      <AppHeader title="Settings" showInput={false} />
      <div className="mx-auto max-w-2xl space-y-10 px-4 py-8 md:px-8">
        <section>
          <p className="section-label">Wallet</p>
          {address ? (
            <div className="mt-4 space-y-3">
              <p className="font-mono text-sm text-accent">{truncateAddress(address, 8, 6)}</p>
              <div className="flex flex-wrap gap-3">
                <Link href={withAddress("/pulse", address)} className="btn-secondary !min-h-11">View Pulse</Link>
                <Link href={withAddress("/portfolio", address)} className="btn-secondary !min-h-11">View Portfolio</Link>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              No wallet scanned.{" "}
              <Link href="/" className="text-accent hover:text-accent-glow">Scan from home</Link>
            </p>
          )}
        </section>
        <section>
          <p className="section-label">Network</p>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">Sui mainnet · Official Sui RPC · read only</p>
        </section>
        <section>
          <p className="section-label">Appearance</p>
          <p className="mt-3">
            <span className="badge bg-white/[0.04] text-gray-400">Dark mode</span>
          </p>
        </section>
        <section>
          <p className="section-label">About</p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-gray-500">
            YetiPulse is a read only briefing of recent Sui activity for an address you paste. The feed is a snapshot of the latest transactions, not lifetime history.
          </p>
        </section>
      </div>
    </>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<><AppHeader title="Settings" showInput={false} /><div className="mx-auto max-w-2xl px-4 py-8" /></>}>
      <SettingsBody />
    </Suspense>
  );
}
