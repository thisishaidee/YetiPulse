"use client";

import { MarketSnapshot } from "@/components/wallet/MarketSnapshot";
import { DemoWalletPreview } from "@/components/wallet/DemoWalletPreview";
import { HowYetiPulseWorks } from "@/components/wallet/HowYetiPulseWorks";

interface DashPreviewProps {
  onViewDemo: () => void;
  isLoading?: boolean;
}

export function DashPreview({ onViewDemo, isLoading }: DashPreviewProps) {
  return (
    <div className="space-y-8">
      <MarketSnapshot />
      <DemoWalletPreview onViewDemo={onViewDemo} isLoading={isLoading} />
      <HowYetiPulseWorks />
    </div>
  );
}
