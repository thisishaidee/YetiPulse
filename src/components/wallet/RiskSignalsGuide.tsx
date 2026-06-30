import { FileWarning, Fish, Coins, Droplets, KeyRound } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const signals = [
  {
    icon: FileWarning,
    title: "Suspicious Contract Interactions",
    desc: "Calls to unverified or newly deployed contracts with no audit history.",
  },
  {
    icon: Fish,
    title: "Phishing Patterns",
    desc: "Transactions linked to known scam addresses or cloned dApp interfaces.",
  },
  {
    icon: Coins,
    title: "Spam Token Behavior",
    desc: "Unsolicited low-value token airdrops designed to bait approval clicks.",
  },
  {
    icon: Droplets,
    title: "Draining Behavior",
    desc: "Rapid, sequential outbound transfers consistent with a compromised key.",
  },
  {
    icon: KeyRound,
    title: "Unusual Approvals",
    desc: "Token or NFT approvals granting broad, indefinite spending access.",
  },
];

/**
 * Educational reference shown before a wallet is analyzed, so the Risk tab
 * reads as a security intelligence center rather than an empty waiting
 * screen. Purely informational — no live data, no claims about any
 * specific wallet.
 */
export function RiskSignalsGuide() {
  return (
    <div>
      <SectionHeader
        label="Security Reference"
        title="Common Risk Signals"
        className="px-1"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {signals.map((signal, i) => {
          const Icon = signal.icon;
          return (
            <div
              key={signal.title}
              className="card-interactive animate-on-load p-5"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                <Icon className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-3 font-medium text-white">{signal.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                {signal.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
