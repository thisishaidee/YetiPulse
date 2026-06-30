import { Search, LineChart, Shield, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Enter wallet",
    description:
      "Paste any Sui wallet address to begin analysis. Use Try Demo to explore with live mainnet data.",
  },
  {
    step: "02",
    icon: LineChart,
    title: "Analyze on-chain activity",
    description:
      "View balances, transaction history, token holdings, and activity patterns pulled from the Sui network.",
  },
  {
    step: "03",
    icon: Shield,
    title: "Detect risks",
    description:
      "Automated risk scoring flags failed transactions, frequent swaps, and interactions with unknown counterparties.",
  },
  {
    step: "04",
    icon: Sparkles,
    title: "Understand transactions in plain English",
    description:
      "Our AI explanation engine translates complex Move calls into clear, human-readable summaries.",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-white/[0.06] bg-surface-raised/30 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label mb-3">How It Works</p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From address to insight in seconds
          </h2>
          <p className="mt-4 text-gray-500">
            YetiPulse bridges the gap between on-chain complexity and human
            understanding — no blockchain expertise required.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => (
            <Reveal
              key={item.step}
              delay={(i + 1) as 1 | 2 | 3 | 4}
              className="card-interactive group relative overflow-hidden p-6"
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
              <div className="relative flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] transition-colors group-hover:bg-accent/10 group-hover:ring-accent/20">
                  <item.icon className="h-5 w-5 text-gray-400 transition-colors group-hover:text-accent" />
                </div>
                <span className="font-mono text-2xl font-bold text-white/[0.06] transition-colors group-hover:text-accent/20">
                  {item.step}
                </span>
              </div>
              <h3 className="relative mt-5 font-semibold text-white">{item.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-gray-500">
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


