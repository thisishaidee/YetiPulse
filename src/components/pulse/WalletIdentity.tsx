"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import type { WalletAnalysis } from "@/types/wallet";
import { truncateAddress } from "@/lib/utils";
import { PulseStatusChip } from "@/components/pulse/PulseStatusChip";

export function WalletIdentity({
  analysis,
  compact = false,
}: {
  analysis: WalletAnalysis;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const short = truncateAddress(analysis.address, 8, 6);

  async function copy() {
    try {
      await navigator.clipboard.writeText(analysis.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="section-label">Active wallet</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="font-mono text-[13px] font-medium text-accent sm:text-sm">{short}</p>
          <button type="button" onClick={copy} className="btn-ghost !min-h-11 !px-2 !py-1 text-gray-500" aria-label="Copy address">
            {copied ? <Check className="h-4 w-4 text-risk-low" /> : <Copy className="h-4 w-4" />}
          </button>
          <a
            href={`https://suiscan.xyz/mainnet/account/${analysis.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost !min-h-11 !px-2 !py-1 text-gray-500"
            aria-label="View on Suiscan"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
      {!compact && (
        <div className="md:text-right">
          <p className="text-3xl font-bold tabular-nums tracking-tight text-white md:text-4xl">
            {analysis.summary.totalBalanceUsd}
          </p>
          <div className="mt-2 flex items-center gap-2 md:justify-end">
            <p className="text-sm text-gray-500">{analysis.summary.totalBalance} SUI</p>
            <PulseStatusChip pulse={analysis.pulse} />
          </div>
        </div>
      )}
    </div>
  );
}
