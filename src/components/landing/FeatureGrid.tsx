import {
  Languages,
  ShieldAlert,
  Fuel,
  Wallet,
  Network,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export function FeatureGrid() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Human-Readable Flows */}
          <Reveal delay={1} className="card-interactive p-6 sm:p-8 lg:col-span-1">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/20">
              <Languages className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Human-Readable Flows
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Our AI engine translates cryptic hexadecimal transactions into
              plain English, instantly revealing intent.
            </p>

            <div className="mt-6 rounded-xl border border-white/[0.06] bg-surface p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-gray-600">
                TX: 0x02f...91e
              </p>
              <p className="mt-2 text-sm text-risk-high line-through decoration-risk-high/40">
                Unknown Move Call
              </p>
              <div className="mt-3 rounded-lg bg-accent/5 px-3 py-2 ring-1 ring-accent/10">
                <p className="text-sm text-accent">
                  Swap 500 SUI for 1.2k USDC on Cetus Protocol
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right column */}
          <div className="grid gap-4">
            <Reveal delay={2} className="card-interactive p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-risk-high/10 ring-1 ring-risk-high/20">
                <ShieldAlert className="h-5 w-5 text-risk-coral" />
              </div>
              <h3 className="font-semibold text-white">Risk Intelligence</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                Real-time alerts for suspicious patterns, failed transactions,
                and unusual counterparties.
              </p>
            </Reveal>

            <div className="grid grid-cols-2 gap-4">
              <Reveal delay={3} className="card-interactive p-5">
                <Fuel className="mb-3 h-5 w-5 text-gray-500" />
                <p className="section-label">Gas Pulse</p>
                <p className="mt-1 text-xs text-gray-500">
                  Track gas costs per transaction
                </p>
              </Reveal>
              <Reveal delay={4} className="card-interactive p-5">
                <Wallet className="mb-3 h-5 w-5 text-gray-500" />
                <p className="section-label">Unified View</p>
                <p className="mt-1 text-xs text-gray-500">
                  Balances, assets & history
                </p>
              </Reveal>
            </div>

            <Reveal
              delay={5}
              className="card-interactive relative overflow-hidden p-6"
            >
              <div className="absolute inset-0 bg-card-glow" />
              <div className="relative">
                <Network className="mb-3 h-5 w-5 text-accent" />
                <h3 className="font-semibold text-white">
                  Visualize the Pulse
                </h3>
                <p className="mt-1.5 text-sm text-gray-500">
                  See every asset move across the Sui ecosystem in a unified
                  analytics dashboard.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
