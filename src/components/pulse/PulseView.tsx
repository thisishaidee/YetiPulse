"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PulseEvent, WalletAnalysis } from "@/types/wallet";
import { withAddress } from "@/lib/nav";
import { WalletInput } from "@/components/ui/WalletInput";
import { WalletIdentity } from "@/components/pulse/WalletIdentity";
import { PulseKpiBand } from "@/components/pulse/PulseKpiBand";
import { PulseBaselineNote } from "@/components/pulse/PulseBaselineNote";
import { PulseFeed } from "@/components/pulse/PulseFeed";
import { PulseEventDetail } from "@/components/pulse/PulseEventDetail";
import { SnapshotFacts } from "@/components/pulse/SnapshotFacts";
import { RecentActivity } from "@/components/pulse/RecentActivity";

export function PulseView({ analysis }: { analysis: WalletAnalysis }) {
  const router = useRouter();
  const events = analysis.pulse?.events ?? [];
  const engineReady = analysis.pulse !== undefined;
  const [selected, setSelected] = useState<PulseEvent | null>(events[0] ?? null);

  return (
    <div className="mx-auto max-w-[1120px] space-y-8 px-4 py-6 sm:py-8 md:px-8">
      <div className="animate-on-load">
        <WalletIdentity analysis={analysis} />
        <PulseBaselineNote analysis={analysis} />
      </div>
      <div className="md:hidden">
        <WalletInput
          key={analysis.address}
          initialValue={analysis.address}
          showDemo={false}
          submitLabel="Scan"
          onSubmit={(address) => router.push(`/pulse?address=${encodeURIComponent(address)}`)}
        />
      </div>
      <div className="animate-on-load stagger-1">
        <PulseKpiBand summary={analysis.summary} />
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div className="animate-on-load stagger-2">
            <p className="section-label">Pulse</p>
            <h2 className="section-title mt-1">What changed</h2>
            <div className="mt-4">
              <PulseFeed events={events} engineReady={engineReady} selectedId={selected?.id} onSelect={setSelected} />
            </div>
          </div>
          <div className="animate-on-load stagger-3">
            <RecentActivity transactions={analysis.transactions} explanations={analysis.explanations} />
          </div>
          <div className="lg:hidden">
            <SnapshotFacts analysis={analysis} />
          </div>
        </div>
        <aside className="hidden space-y-6 lg:col-span-4 lg:block">
          <SnapshotFacts analysis={analysis} />
          <PulseEventDetail event={selected} />
          <Link href={withAddress("/portfolio", analysis.address)} className="inline-flex text-sm text-accent hover:text-accent-glow">
            Open portfolio →
          </Link>
        </aside>
      </div>
      <div className="lg:hidden">
        <Link href={withAddress("/portfolio", analysis.address)} className="inline-flex min-h-11 items-center text-sm text-accent">
          Open portfolio →
        </Link>
      </div>
    </div>
  );
}
