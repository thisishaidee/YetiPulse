import { AlertTriangle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

const demoThreats = [
  {
    id: "demo-airdrop",
    level: "medium" as const,
    title: "Risky NFT Airdrop",
    description:
      "An unsolicited NFT was sent to the wallet with an embedded link to an off-chain claim site — a common vector for wallet-draining scams.",
    icon: AlertTriangle,
  },
  {
    id: "demo-approval",
    level: "high" as const,
    title: "Suspicious Token Approval",
    description:
      "A token approval request granted unlimited spending allowance to a contract with no verified source code.",
    icon: AlertOctagon,
  },
  {
    id: "demo-contract",
    level: "high" as const,
    title: "Malicious Contract Interaction",
    description:
      "A transaction interacted with a contract flagged by community reports for draining connected wallets shortly after approval.",
    icon: AlertOctagon,
  },
];

const levelStyles = {
  medium: {
    border: "border-l-risk-medium/50",
    iconBg: "bg-risk-medium/10",
    color: "text-risk-medium",
    dot: "bg-risk-medium",
  },
  high: {
    border: "border-l-risk-high/50",
    iconBg: "bg-risk-high/10",
    color: "text-risk-high",
    dot: "bg-risk-high",
  },
};

/**
 * Illustrative threat examples shown before a wallet is analyzed, reusing
 * the same alert-row visual structure as RiskAlerts.tsx so the Risk tab
 * already looks and feels like the real thing. These are clearly labeled
 * as examples, not findings about any actual wallet.
 */
export function DemoThreatExamples() {
  return (
    <div>
      <SectionHeader
        label="Example Findings"
        title="Recent Threat Examples"
        action={
          <span className="badge border border-white/[0.06] bg-white/[0.03] font-mono text-[10px] uppercase tracking-wider text-gray-500">
            Demo Data
          </span>
        }
        className="px-1"
      />
      <div className="space-y-3">
        {demoThreats.map((threat, i) => {
          const config = levelStyles[threat.level];
          const Icon = threat.icon;
          return (
            <div
              key={threat.id}
              className={cn(
                "card animate-on-load border-l-2 p-4 sm:p-5",
                config.border
              )}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    config.iconBg
                  )}
                >
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-white">{threat.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                    {threat.description}
                  </p>
                  <span
                    className={cn(
                      "mt-3 inline-flex items-center gap-1.5 badge border border-white/[0.06] bg-white/[0.03]",
                      config.color
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
                    {threat.level}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
