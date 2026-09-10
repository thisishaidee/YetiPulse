import {
  ArrowDownLeft,
  ArrowUpRight,
  Image,
  Inbox,
  Lock,
  RefreshCw,
} from "lucide-react";
import type { AIExplanation, Transaction } from "@/types/wallet";
import { cn, truncateAddress } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";

const typeConfig = {
  send: { icon: ArrowUpRight, color: "text-risk-high", bg: "bg-risk-high/10", label: "Send" },
  receive: { icon: ArrowDownLeft, color: "text-risk-low", bg: "bg-risk-low/10", label: "Receive" },
  swap: { icon: RefreshCw, color: "text-accent", bg: "bg-accent/10", label: "Swap" },
  stake: { icon: Lock, color: "text-purple-400", bg: "bg-purple-500/10", label: "Stake" },
  nft: { icon: Image, color: "text-pink-400", bg: "bg-pink-500/10", label: "NFT" },
};

export function RecentActivity({
  transactions,
  explanations = [],
  limit = 5,
}: {
  transactions: Transaction[];
  explanations?: AIExplanation[];
  limit?: number;
}) {
  const rows = transactions.slice(0, limit);
  const explanationMap = new Map(explanations.map((item) => [item.transactionDigest, item]));

  return (
    <div>
      <p className="section-label">Evidence</p>
      <h2 className="section-title mt-1">Recent activity</h2>
      {rows.length === 0 ? (
        <div className="card mt-4">
          <EmptyState icon={Inbox} title="No recent activity" description="This snapshot contains no transactions." />
        </div>
      ) : (
        <div className="card mt-4 overflow-hidden !p-0">
          <div className="divide-y divide-white/[0.04]">
            {rows.map((tx) => {
              const config = typeConfig[tx.type];
              const Icon = config.icon;
              const summary = explanationMap.get(tx.digest)?.summary;
              return (
                <div key={tx.id} className="px-4 py-3.5 sm:px-5">
                  <div className="flex items-start gap-3">
                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", config.bg)}>
                      <Icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-200">{config.label}</p>
                          <p className="mt-0.5 truncate font-mono text-[11px] text-gray-600">
                            {tx.counterparty.startsWith("0x") ? truncateAddress(tx.counterparty) : tx.counterparty} · {tx.timestamp}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-mono text-sm font-semibold tabular-nums text-gray-200">{tx.amount}</p>
                          <p className={cn("mt-0.5 text-[11px] capitalize", tx.status === "success" ? "text-risk-low" : "text-risk-high")}>
                            {tx.status}
                          </p>
                        </div>
                      </div>
                      {summary && (
                        <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
                          <span className="mr-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-gray-400">Summary</span>
                          {summary}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
