"use client";

import { Wallet, History, Copy, Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { truncateAddress } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface AccountSettingsProps {
  address: string;
  transactionCount: number;
}

export function AccountSettings({
  address,
  transactionCount,
}: AccountSettingsProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <SectionHeader label="Account" title="Connected Wallet" className="px-1" />

      <div className="card animate-on-load divide-y divide-white/[0.04] !p-0">
        <button
          type="button"
          onClick={handleCopy}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.02] active:bg-white/[0.03] sm:px-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
              <Wallet className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Active Wallet</p>
              <p className="font-mono text-[11px] text-accent">
                {truncateAddress(address, 6, 4)}
              </p>
            </div>
          </div>
          {copied ? (
            <Check className="h-4 w-4 shrink-0 text-risk-low" />
          ) : (
            <Copy className="h-4 w-4 shrink-0 text-gray-600" />
          )}
        </button>

        <Link
          href="#history"
          className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02] active:bg-white/[0.03] sm:px-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
              <History className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                Transaction History
              </p>
              <p className="text-xs text-gray-600">
                {transactionCount.toLocaleString()} recorded
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-gray-600" />
        </Link>
      </div>
    </div>
  );
}
