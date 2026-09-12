"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Lock,
  Image,
  Inbox,
} from "lucide-react";
import type { Transaction, AIExplanation } from "@/types/wallet";
import { cn, truncateAddress } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface TransactionListProps {
  transactions: Transaction[];
  explanations?: AIExplanation[];
}

const typeConfig = {
  send: { icon: ArrowUpRight, color: "text-risk-high", bg: "bg-risk-high/10", label: "Send" },
  receive: { icon: ArrowDownLeft, color: "text-risk-low", bg: "bg-risk-low/10", label: "Receive" },
  swap: { icon: RefreshCw, color: "text-accent", bg: "bg-accent/10", label: "Swap" },
  stake: { icon: Lock, color: "text-purple-400", bg: "bg-purple-500/10", label: "Stake" },
  nft: { icon: Image, color: "text-pink-400", bg: "bg-pink-500/10", label: "NFT" },
};

const filters = [
  { id: "all", label: "All" },
  { id: "swap", label: "Swaps" },
  { id: "transfer", label: "Transfers" },
  { id: "nft", label: "NFTs" },
  { id: "stake", label: "Stake" },
] as const;

type FilterId = (typeof filters)[number]["id"];

function matchesFilter(tx: Transaction, filter: FilterId): boolean {
  if (filter === "all") return true;
  if (filter === "swap") return tx.type === "swap";
  if (filter === "nft") return tx.type === "nft";
  if (filter === "stake") return tx.type === "stake";
  return tx.type === "send" || tx.type === "receive";
}

function displayCounterparty(value: string): string {
  if (value.startsWith("0x")) return truncateAddress(value);
  if (value === "\u2014" || value === "\u2013" || value === "-" || !value) return "unknown";
  return value;
}

export function TransactionList({
  transactions,
  explanations = [],
}: TransactionListProps) {
  const [filter, setFilter] = useState<FilterId>("all");

  const explanationMap = useMemo(() => {
    const map = new Map<string, AIExplanation>();
    for (const ex of explanations) {
      map.set(ex.transactionDigest, ex);
    }
    return map;
  }, [explanations]);

  const filtered = transactions.filter((tx) => matchesFilter(tx, filter));

  return (
    <div id="history" className="card scroll-mt-24 overflow-hidden !p-0">
      <div className="border-b border-white/[0.06] px-5 py-5 sm:px-6">
        <SectionHeader
          label="History"
          title="Recent Activity"
          description={`Showing ${transactions.length} recent transactions`}
        />

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "min-h-11 shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95",
                filter === f.id
                  ? "bg-accent text-surface"
                  : "border border-white/[0.06] bg-white/[0.03] text-gray-500 hover:text-gray-300"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No transactions found"
          description={
            filter === "all"
              ? "This wallet has no recent on chain activity to display."
              : `No ${filter} transactions in recent history.`
          }
        />
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {filtered.map((tx, i) => {
            const config = typeConfig[tx.type];
            const Icon = config.icon;
            const explanation = explanationMap.get(tx.digest);

            return (
              <div
                key={tx.id}
                className="group animate-on-load px-4 py-3.5 transition-colors hover:bg-white/[0.02] sm:px-6"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        config.bg
                      )}
                    >
                      <Icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    {i < filtered.length - 1 && (
                      <div className="mt-2 w-px flex-1 bg-white/[0.06]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pb-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight text-gray-300">
                          {config.label}
                        </p>
                        <p className="mt-0.5 truncate font-mono text-[11px] uppercase tracking-wider text-gray-600">
                          {displayCounterparty(tx.counterparty)} · {tx.timestamp}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p
                          className={cn(
                            "font-mono text-base font-semibold leading-tight",
                            tx.amount.startsWith("+")
                              ? "text-risk-low"
                              : tx.amount.startsWith("-")
                                ? "text-risk-high"
                                : "text-gray-300"
                          )}
                        >
                          {tx.amount}
                        </p>
                        <p className="mt-0.5 text-xs leading-tight text-gray-600">
                          {tx.usdValue !== undefined
                            ? tx.usdValue.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : tx.token}
                        </p>
                      </div>
                    </div>

                    {explanation && (
                      <div className="mt-2.5 rounded-lg bg-white/[0.03] px-3 py-2.5 ring-1 ring-white/[0.06]">
                        <p className="text-[13px] leading-relaxed text-gray-300">
                          <span className="mr-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                            Summary
                          </span>
                          {explanation.summary}
                        </p>
                      </div>
                    )}

                    <div className="mt-2 flex min-w-0 items-center gap-2">
                      <span
                        className={cn(
                          "badge shrink-0",
                          tx.status === "success"
                            ? "bg-risk-low/10 text-risk-low"
                            : "bg-risk-high/10 text-risk-high"
                        )}
                      >
                        {tx.status}
                      </span>
                      <span className="min-w-0 truncate font-mono text-[10px] text-gray-600">
                        {tx.digest}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
