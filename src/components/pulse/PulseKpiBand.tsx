import type { WalletSummary } from "@/types/wallet";

export function PulseKpiBand({ summary }: { summary: WalletSummary }) {
  const slots = [
    { label: "Net worth", value: summary.totalBalanceUsd },
    { label: "Transactions", value: String(summary.transactionCount) },
    { label: "Tokens", value: String(summary.uniqueTokens) },
    { label: "Last activity", value: summary.lastActivity },
  ];

  return (
    <div className="card overflow-hidden !p-0">
      <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-white/[0.06]">
        {slots.map((slot, index) => (
          <div
            key={slot.label}
            className={`px-5 py-5 sm:px-6 ${index < 2 ? "border-b border-white/[0.06] md:border-b-0" : ""} ${index % 2 === 0 ? "border-r border-white/[0.06] md:border-r-0" : ""}`}
          >
            <p className="section-label">{slot.label}</p>
            <p className="mt-2 text-xl font-bold tabular-nums text-white sm:text-2xl">{slot.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
