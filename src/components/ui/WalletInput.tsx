"use client";

import { AlertCircle, type LucideIcon } from "lucide-react";
import { useState, FormEvent } from "react";
import { isValidSuiAddress } from "@/lib/utils";
import { DEMO_WALLET_ADDRESS } from "@/lib/sui/constants";

interface WalletInputProps {
  onSubmit: (address: string) => void;
  initialValue?: string;
  isLoading?: boolean;
  size?: "default" | "large";
  submitLabel?: string;
  submitIcon?: LucideIcon;
  showDemo?: boolean;
}

export function WalletInput({
  onSubmit,
  initialValue = "",
  isLoading = false,
  size = "default",
  submitLabel = "Scan",
  submitIcon: SubmitIcon,
  showDemo = true,
}: WalletInputProps) {
  const [address, setAddress] = useState(initialValue);
  const [error, setError] = useState("");
  const loadingLabel = submitLabel === "Analyze" ? "Analyzing..." : "Scanning...";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = address.trim();

    if (!trimmed) {
      setError("Please enter a wallet address");
      return;
    }

    if (!isValidSuiAddress(trimmed)) {
      setError("Invalid Sui wallet address.");
      return;
    }

    setError("");
    onSubmit(trimmed);
  }

  function handleDemo() {
    setAddress(DEMO_WALLET_ADDRESS);
    setError("");
    onSubmit(DEMO_WALLET_ADDRESS);
  }

  const isLarge = size === "large";

  if (isLarge) {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex items-center rounded-2xl border border-white/[0.08] bg-surface-hover p-1.5 transition-all duration-200 focus-within:border-accent/30 focus-within:ring-2 focus-within:ring-accent/10">
          <input
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setError("");
            }}
            placeholder="Enter Sui Address"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 font-mono text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary shrink-0 !min-h-11 !rounded-xl !px-5 !py-2.5"
          >
            {SubmitIcon && <SubmitIcon className="h-4 w-4" />}
            {isLoading ? loadingLabel : submitLabel}
          </button>
        </div>
        {showDemo && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={handleDemo}
              disabled={isLoading}
              className="min-h-11 text-sm text-gray-500 transition-colors hover:text-accent active:scale-95"
            >
              or try a live demo wallet →
            </button>
          </div>
        )}
        {error && (
          <div className="animate-on-load mt-3 flex items-center justify-center gap-2 text-sm text-risk-high">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setError("");
          }}
          placeholder="Enter Sui Address"
          className="input-field"
          disabled={isLoading}
        />
        <div className="flex gap-2 sm:shrink-0">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary min-h-11 whitespace-nowrap"
          >
            {SubmitIcon && <SubmitIcon className="h-4 w-4" />}
            {isLoading ? loadingLabel : submitLabel}
          </button>
          {showDemo && (
            <button
              type="button"
              onClick={handleDemo}
              disabled={isLoading}
              className="btn-secondary min-h-11 whitespace-nowrap"
            >
              Try Demo
            </button>
          )}
        </div>
      </div>
      {error && (
        <div className="animate-on-load mt-3 flex items-center gap-2 text-sm text-risk-high">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}
