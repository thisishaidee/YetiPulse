import type { WalletSummary } from "@/types/wallet";

function displayValue(label: string, value: string): string {
  if (!value || value === "\u2014" || value === "\u2013") return "n/a";
  if (label !== "Last activity") return value;
  return value
    .replace("Just now", "Now")
    .replace(" hours ago", "h ago")
    .replace(" hour ago", "h ago")
    .replace(" min ago", "m ago")
    .replace(" days ago", "d ago")
    .replace(" day ago", "d ago")
    .replace(" weeks ago", "w ago")
    .replace(" week ago", "w ago");
}

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
            className={`flex min-h-[92px] flex-col justify-between px-4 py-4 sm:min-h-[104px] sm:px-6 ${index < 2 ? "border-b border-white/[0.06] md:border-b-0" : ""} ${index % 2 === 0 ? "border-r border-white/[0.06] md:border-r-0" : ""}`}
          >
            <p className="section-label">{slot.label}</p>
            <p className="mt-3 min-h-[1.75rem] truncate text-lg font-bold leading-none tabular-nums text-white sm:text-xl md:min-h-8 md:text-2xl">
              {displayValue(slot.label, slot.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
