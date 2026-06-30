import { ShieldCheck, Wallet, History } from "lucide-react";
import type { WalletSummary } from "@/types/wallet";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  summary: WalletSummary;
}

const riskScoreColor: Record<WalletSummary["riskLevel"], string> = {
  low: "text-risk-low",
  medium: "text-risk-medium",
  high: "text-risk-high",
};

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="card-interactive p-5">
        <div className="flex items-start justify-between">
          <p className="section-label">Risk Score</p>
          <ShieldCheck className={cn("h-4 w-4", riskScoreColor[summary.riskLevel])} />
        </div>
        <p
          className={cn(
            "mt-2 text-2xl font-bold",
            riskScoreColor[summary.riskLevel]
          )}
        >
          {summary.riskScore}
          <span className="text-sm font-medium text-gray-600">/100</span>
        </p>
        <p className="mt-0.5 text-xs capitalize text-gray-600">
          {summary.riskLevel} risk
        </p>
      </div>

      <div className="card-interactive p-5">
        <div className="flex items-start justify-between">
          <p className="section-label">Portfolio Value</p>
          <Wallet className="h-4 w-4 text-accent" />
        </div>
        <p className="mt-2 text-2xl font-bold text-white">
          {summary.totalBalanceUsd}
        </p>
        <p className="mt-0.5 text-xs text-gray-600">{summary.totalBalance} SUI</p>
      </div>

      <div className="card-interactive col-span-2 flex items-center justify-between p-5">
        <div>
          <p className="section-label">Total Transactions</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {summary.transactionCount.toLocaleString()}
          </p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
          <History className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
}
