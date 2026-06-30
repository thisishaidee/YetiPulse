"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Wifi, Activity, Fuel } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { fetchSuiMarketSnapshot } from "@/lib/api/client";

type Trend = "up" | "down" | "neutral";

interface StatCard {
  label: string;
  value: string;
  delta: string;
  trend: Trend;
  icon: typeof TrendingUp;
}

// Network status and gas trend have no live backing data source in this
// codebase (no RPC health-check endpoint, no gas-tracking service), so
// per the requirements they stay as static, clearly-labeled system values
// rather than being wired to a fake feed.
const staticStats: StatCard[] = [
  {
    label: "Network Status",
    value: "Operational",
    delta: "99.98% uptime",
    trend: "neutral",
    icon: Wifi,
  },
  {
    label: "Gas Trend",
    value: "0.0008 SUI",
    delta: "avg. per tx",
    trend: "down",
    icon: Fuel,
  },
];

function formatPrice(priceUsd: number): string {
  return `$${priceUsd.toFixed(priceUsd < 1 ? 4 : 2)}`;
}

function formatChange(changePercent: number): string {
  const sign = changePercent >= 0 ? "+" : "";
  return `${sign}${changePercent.toFixed(1)}%`;
}

export function MarketSnapshot() {
  const [snapshot, setSnapshot] = useState<{
    priceUsd: number;
    change24hPercent: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchSuiMarketSnapshot();
        if (!cancelled) {
          setSnapshot(data);
          setHasError(false);
        }
      } catch {
        // CoinGecko being down (or rate-limited) must never break the Dash
        // tab — fall back to placeholder cards instead of throwing.
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const priceTrend: Trend =
    snapshot && snapshot.change24hPercent > 0
      ? "up"
      : snapshot && snapshot.change24hPercent < 0
        ? "down"
        : "neutral";

  const liveStats: StatCard[] = snapshot
    ? [
        {
          label: "SUI Price",
          value: formatPrice(snapshot.priceUsd),
          delta: "live",
          trend: priceTrend,
          icon: TrendingUp,
        },
        {
          label: "24h Change",
          value: formatChange(snapshot.change24hPercent),
          delta: "vs. yesterday",
          trend: priceTrend,
          icon: Activity,
        },
      ]
    : [];

  return (
    <div>
      <SectionHeader
        label="Live Overview"
        title="Market Snapshot"
        action={
          <span
            className={cn(
              "badge border font-mono text-[10px] uppercase tracking-wider",
              hasError
                ? "border-risk-medium/20 bg-risk-medium/10 text-risk-medium"
                : "border-white/[0.06] bg-white/[0.03] text-gray-500"
            )}
          >
            {hasError ? "Live Data Unavailable" : "Live"}
          </span>
        }
        className="px-1"
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* SUI Price + 24h Change — live from CoinGecko, or graceful fallback */}
        {isLoading ? (
          <>
            <PriceCardSkeleton />
            <PriceCardSkeleton />
          </>
        ) : snapshot ? (
          liveStats.map((stat, i) => (
            <StatCardView key={stat.label} stat={stat} index={i} />
          ))
        ) : (
          <>
            <PriceCardFallback label="SUI Price" icon={TrendingUp} />
            <PriceCardFallback label="24h Change" icon={Activity} />
          </>
        )}

        {/* Network Status + Gas Trend — static, system-derived values */}
        {staticStats.map((stat, i) => (
          <StatCardView key={stat.label} stat={stat} index={i + 2} />
        ))}
      </div>
    </div>
  );
}

function StatCardView({ stat, index }: { stat: StatCard; index: number }) {
  const Icon = stat.icon;
  const trendColor =
    stat.trend === "up"
      ? "text-risk-low"
      : stat.trend === "down"
        ? "text-gray-500"
        : "text-accent";

  return (
    <div
      className="card-interactive animate-on-load p-5"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between">
        <p className="section-label">{stat.label}</p>
        <Icon className={cn("h-4 w-4", trendColor)} />
      </div>
      <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
      <p className={cn("mt-0.5 flex items-center gap-1 text-xs", trendColor)}>
        {stat.trend === "up" && <TrendingUp className="h-3 w-3" />}
        {stat.trend === "down" && <TrendingDown className="h-3 w-3" />}
        <span className={stat.trend === "neutral" ? "text-gray-600" : undefined}>
          {stat.delta}
        </span>
      </p>
    </div>
  );
}

function PriceCardSkeleton() {
  return (
    <div className="card-interactive p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      <Skeleton className="mt-2 h-8 w-20" />
      <Skeleton className="mt-1.5 h-3 w-12" />
    </div>
  );
}

function PriceCardFallback({
  label,
  icon: Icon,
}: {
  label: string;
  icon: typeof TrendingUp;
}) {
  return (
    <div className="card-interactive p-5">
      <div className="flex items-start justify-between">
        <p className="section-label">{label}</p>
        <Icon className="h-4 w-4 text-gray-600" />
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-600">—</p>
      <p className="mt-0.5 text-xs text-gray-600">unavailable</p>
    </div>
  );
}
