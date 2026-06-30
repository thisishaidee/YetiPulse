import { GitBranch, ShieldAlert, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const capabilities = [
  {
    icon: GitBranch,
    title: "Transaction Pattern Analysis",
    desc: "Identifies abnormal sequences, timing, and counterparties across a wallet's full on-chain history.",
  },
  {
    icon: ShieldAlert,
    title: "Contract Risk Detection",
    desc: "Flags interactions with unverified, newly deployed, or community-reported malicious contracts.",
  },
  {
    icon: Sparkles,
    title: "Asset Anomaly Detection",
    desc: "Surfaces unusual incoming assets, spam tokens, and approval requests that don't match normal usage.",
  },
];

export function RiskDetectionCapabilities() {
  return (
    <div>
      <SectionHeader
        label="Engine"
        title="Risk Detection Capabilities"
        className="px-1"
      />
      <div className="grid gap-3 sm:grid-cols-3">
        {capabilities.map((cap, i) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.title}
              className="card animate-on-load p-5"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                <Icon className="h-4 w-4 text-accent" />
              </div>
              <p className="mt-3 font-medium text-white">{cap.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                {cap.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
