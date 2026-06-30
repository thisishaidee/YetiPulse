"use client";

import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { truncateAddress, cn } from "@/lib/utils";
import type { WalletSummary } from "@/types/wallet";

interface WalletOverviewProps {
  address: string;
  summary: WalletSummary;
}

const riskBadgeStyles: Record<WalletSummary["riskLevel"], string> = {
  low: "bg-risk-low/10 text-risk-low",
  medium: "bg-risk-medium/10 text-risk-medium",
  high: "bg-risk-high/10 text-risk-high",
};

export function WalletOverview({ address, summary }: WalletOverviewProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card animate-scale-in relative overflow-hidden !p-0">
      <div className="absolute inset-0 bg-card-glow" />
      <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8 lg:p-8">
        <div className="min-w-0">
          <p className="section-label">Active Address</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <p className="truncate font-mono text-sm font-medium text-accent sm:text-base">
              {truncateAddress(address, 8, 6)}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-white/[0.04] hover:text-white active:scale-90"
              aria-label="Copy address"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-risk-low" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
            <a
              href={`https://suiscan.xyz/mainnet/account/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              title="View on Suiscan"
              className="shrink-0 rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-white/[0.04] hover:text-accent active:scale-90"
              aria-label="View on Suiscan"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="lg:text-right">
          <p className="section-label lg:text-right">Net Worth</p>
          <p className="mt-1.5 text-[2.25rem] font-bold leading-none tracking-tight text-white sm:text-4xl">
            {summary.totalBalanceUsd}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2 lg:justify-end">
            <span className="badge bg-accent/10 font-mono text-[10px] uppercase tracking-wider text-accent">
              {summary.totalBalance} SUI
            </span>
            <span
              className={cn(
                "badge font-mono text-[10px] uppercase tracking-wider",
                riskBadgeStyles[summary.riskLevel]
              )}
            >
              {summary.riskLevel} risk
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
