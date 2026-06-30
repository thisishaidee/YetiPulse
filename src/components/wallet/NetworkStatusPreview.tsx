import { Server, Wifi, Gauge } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function NetworkStatusPreview() {
  return (
    <div>
      <SectionHeader label="Configuration" title="Network Status" className="px-1" />

      <div className="card animate-on-load divide-y divide-white/[0.04] !p-0">
        <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
              <Server className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Active Network</p>
              <p className="font-mono text-[11px] text-gray-600">Sui Mainnet</p>
            </div>
          </div>
          <span className="badge shrink-0 border border-risk-low/20 bg-risk-low/10 font-mono text-[10px] uppercase tracking-wider text-risk-low">
            <Wifi className="mr-1 h-3 w-3" />
            Connected
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
              <Server className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">RPC Endpoint</p>
              <p className="font-mono text-[11px] text-gray-600">
                fullnode.mainnet.sui.io
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
              <Gauge className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-sm font-medium text-white">Connection Health</p>
          </div>
          <span className="font-mono text-xs text-risk-low">~48ms latency</span>
        </div>
      </div>
    </div>
  );
}
