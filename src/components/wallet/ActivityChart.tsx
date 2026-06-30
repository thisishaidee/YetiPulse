"use client";

import { useEffect, useMemo, useState } from "react";
import type { Transaction } from "@/types/wallet";

interface ActivityChartProps {
  transactions: Transaction[];
}

const DAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"] as const;

export function ActivityChart({ transactions }: ActivityChartProps) {
  const { bars, labels } = useMemo(() => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const counts = dates.map((date) => {
      const dateStr = date.toDateString();
      return transactions.filter((tx) => {
        const ts = tx.timestamp.toLowerCase();
        if (ts.includes("just now") || ts.includes("min") || ts.includes("hour")) {
          return dateStr === new Date().toDateString();
        }
        if (ts.includes("day")) {
          const num = parseInt(ts, 10);
          const d = new Date();
          d.setDate(d.getDate() - num);
          return d.toDateString() === dateStr;
        }
        return false;
      }).length;
    });

    const max = Math.max(...counts, 1);
    return {
      bars: counts.map((c) => (c / max) * 100),
      // Derive single-letter day labels from the actual computed dates
      labels: dates.map((d) => DAY_INITIALS[d.getDay()]),
    };
  }, [transactions]);

  // Bars mount at 0 and grow to their real height on the next frame, so the
  // existing `transition-all` actually has something to animate from instead
  // of rendering at final height on first paint.
  const [hasGrown, setHasGrown] = useState(false);

  useEffect(() => {
    setHasGrown(false);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setHasGrown(true);
      return;
    }

    const frame = requestAnimationFrame(() => setHasGrown(true));
    return () => cancelAnimationFrame(frame);
  }, [bars]);

  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="section-label">Activity</p>
          <h3 className="section-title">7 Day Overview</h3>
        </div>
        <div className="flex rounded-lg border border-white/[0.06] bg-surface p-0.5">
          {/* Non-interactive: the underlying timestamp data is a pre-formatted
              relative string ("2 hours ago"), not a real Date, so there's no
              data to recompute a 1D/1M window from at this layer. Shown as
              static chips (matching the Stitch reference's visual) rather
              than buttons that look clickable but do nothing. */}
          {["1D", "7D", "1M"].map((period) => (
            <span
              key={period}
              className={`rounded-md px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${
                period === "7D"
                  ? "bg-white/[0.08] text-white"
                  : "text-gray-600"
              }`}
            >
              {period}
            </span>
          ))}
        </div>
      </div>

      <div className="flex h-28 items-end gap-1.5 sm:gap-2">
        {bars.map((height, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-md bg-chart-bar transition-[height] duration-700 ease-out motion-reduce:transition-none"
              style={{
                height: `${hasGrown ? Math.max(height, 8) : 0}%`,
                transitionDelay: `${i * 60}ms`,
              }}
            />
            <span className="font-mono text-[10px] text-gray-600">
              {labels[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
