import { Server, Wifi, Settings2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function NetworkSettings() {
  return (
    <div>
      <SectionHeader
        label="Configuration"
        title="Sui Network"
        className="px-1"
      />

      <div className="card animate-on-load divide-y divide-white/[0.04] !p-0">
        <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
              <Server className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Mainnet Node</p>
              <p className="font-mono text-[11px] text-gray-600">
                fullnode.mainnet.sui.io
              </p>
            </div>
          </div>
          <span className="badge shrink-0 border border-risk-low/20 bg-risk-low/10 font-mono text-[10px] uppercase tracking-wider text-risk-low">
            <Wifi className="mr-1 h-3 w-3" />
            Connected
          </span>
        </div>

        {/* Static display row — no RPC configuration backend exists yet */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
              <Settings2 className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-sm font-medium text-white">RPC Settings</p>
          </div>
          <Settings2 className="h-4 w-4 shrink-0 text-gray-600" />
        </div>

        <div className="px-5 py-3.5 sm:px-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-gray-600">
            YetiPulse Analytics v2.4.1
          </p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            Institutional grade blockchain intelligence for the Sui ecosystem.
          </p>
        </div>
      </div>
    </div>
  );
}
