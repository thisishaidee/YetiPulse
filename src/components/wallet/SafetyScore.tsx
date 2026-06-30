"use client";

import { useEffect, useState } from "react";
import type { WalletSummary } from "@/types/wallet";
import { cn } from "@/lib/utils";

interface SafetyScoreProps {
  summary: WalletSummary;
}

export function SafetyScore({ summary }: SafetyScoreProps) {
  // riskScore is "higher = riskier" (see analysis.transformer.ts: computeRiskScore).
  // We invert it so the displayed number reads as a safety score (higher = safer),
  // matching the Stitch reference which shows e.g. "74" for a moderate-risk wallet.
  const safetyScore = 100 - summary.riskScore;
  const circumference = 2 * Math.PI * 88;

  // Ring mounts at 0 and animates to its real value on the next frame so the
  // draw-in transition actually has something to animate from.
  const [animatedSafetyScore, setAnimatedSafetyScore] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setAnimatedSafetyScore(safetyScore);
      return;
    }

    const frame = requestAnimationFrame(() => setAnimatedSafetyScore(safetyScore));
    return () => cancelAnimationFrame(frame);
  }, [safetyScore]);

  // The arc fill represents how much of the ring is "safe" (i.e. safetyScore%).
  const offset = circumference - (animatedSafetyScore / 100) * circumference;

  const levelLabel =
    summary.riskLevel === "low"
      ? "Low Risk"
      : summary.riskLevel === "medium"
        ? "Moderate Risk"
        : "High Risk";

  const levelColor =
    summary.riskLevel === "low"
      ? "text-risk-low"
      : summary.riskLevel === "medium"
        ? "text-risk-coral"
        : "text-risk-high";

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative">
        <svg
          className="h-[220px] w-[220px] -rotate-90 sm:h-60 sm:w-60"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-[1100ms] ease-out motion-reduce:transition-none"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7cb9ff" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="section-label">Safety Score</p>
          <span className="mt-1 text-5xl font-bold text-white tabular-nums sm:text-6xl">
            {animatedSafetyScore}
          </span>
          <span
            className={cn(
              "mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider",
              levelColor
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {levelLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
