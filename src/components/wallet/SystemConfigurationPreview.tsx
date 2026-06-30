import { History } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NetworkSettings } from "@/components/wallet/NetworkSettings";

/**
 * Pre-wallet System Configuration section. Reuses the existing
 * NetworkSettings component verbatim (RPC Settings row + analytics
 * version footer) and adds a disabled wallet-history shortcut — disabled
 * rather than hidden, so it's honest about why it can't be used yet
 * instead of pretending to be interactive.
 */
export function SystemConfigurationPreview() {
  return (
    <div>
      <NetworkSettings />

      <div className="mt-8">
        <SectionHeader label="Account" title="Wallet History" className="px-1" />
        <div className="card animate-on-load !p-0">
          <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                <History className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Transaction History
                </p>
                <p className="text-xs text-gray-600">
                  Analyze a wallet to view its history
                </p>
              </div>
            </div>
            <span className="cursor-not-allowed text-xs text-gray-600">
              Unavailable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
