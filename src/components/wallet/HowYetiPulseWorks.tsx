import Link from "next/link";
import { Search, LineChart, Shield, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  { icon: Search, title: "Enter wallet", desc: "Paste any Sui address" },
  { icon: LineChart, title: "Analyze activity", desc: "Live on-chain data" },
  { icon: Shield, title: "Detect risks", desc: "Automated scoring" },
  { icon: Sparkles, title: "Plain English", desc: "AI explanations" },
];

export function HowYetiPulseWorks() {
  return (
    <div>
      <p className="section-label mb-4 px-1">How YetiPulse Works</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="card-interactive p-5 animate-on-load"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <span className="font-mono text-[10px] text-gray-600">
              STEP {i + 1}
            </span>
            <div className="mt-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]">
              <step.icon className="h-4 w-4 text-accent" />
            </div>
            <p className="mt-3 font-medium text-white">{step.title}</p>
            <p className="mt-1 text-xs text-gray-600">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/#how-it-works"
          className="inline-flex items-center gap-1.5 text-sm text-accent transition-colors hover:text-accent-glow active:scale-95"
        >
          Learn more about YetiPulse
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
