import { Wallet, History, Image as ImageIcon, ShieldCheck, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface DemoWalletPreviewProps {
  onViewDemo: () => void;
  isLoading?: boolean;
}

/**
 * A static preview of what a real analysis looks like, using the same
 * SummaryCards-style stat blocks. Numbers are fixed illustrative figures —
 * the "Demo Preview" badge makes that explicit. The CTA below routes
 * through the exact same handleDemo() path as the WalletInput's own
 * "Try Demo" button, so there's only one source of truth for what "demo"
 * means in this app.
 */
export function DemoWalletPreview({ onViewDemo, isLoading }: DemoWalletPreviewProps) {
  return (
    <div>
      <SectionHeader
        label="Example Wallet"
        title="Demo Wallet Preview"
        action={
          <span className="badge border border-white/[0.06] bg-white/[0.03] font-mono text-[10px] uppercase tracking-wider text-gray-500">
            Demo Preview
          </span>
        }
        className="px-1"
      />

      <div className="card animate-on-load overflow-hidden !p-0">
        <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.04] sm:grid-cols-4 sm:divide-y-0">
          <div className="p-5">
            <div className="flex items-start justify-between">
              <p className="section-label">Balance</p>
              <Wallet className="h-4 w-4 text-accent" />
            </div>
            <p className="mt-2 text-xl font-bold text-white">$8,420.50</p>
            <p className="mt-0.5 text-xs text-gray-600">2,041 SUI</p>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between">
              <p className="section-label">Transactions</p>
              <History className="h-4 w-4 text-gray-500" />
            </div>
            <p className="mt-2 text-xl font-bold text-white">312</p>
            <p className="mt-0.5 text-xs text-gray-600">all-time</p>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between">
              <p className="section-label">Owned Assets</p>
              <ImageIcon className="h-4 w-4 text-gray-500" />
            </div>
            <p className="mt-2 text-xl font-bold text-white">7</p>
            <p className="mt-0.5 text-xs text-gray-600">NFTs & objects</p>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between">
              <p className="section-label">Safety Score</p>
              <ShieldCheck className="h-4 w-4 text-risk-low" />
            </div>
            <p className="mt-2 text-xl font-bold text-risk-low">91</p>
            <p className="mt-0.5 text-xs text-gray-600">low risk</p>
          </div>
        </div>

        <div className="border-t border-white/[0.04] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onViewDemo}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-glow active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Loading demo analysis..." : "View demo analysis"}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
