import { ShieldAlert } from "lucide-react";
import type { RiskAlert } from "@/types/wallet";
import { cn } from "@/lib/utils";

interface CriticalAlertBannerProps {
  alerts: RiskAlert[];
}

export function CriticalAlertBanner({ alerts }: CriticalAlertBannerProps) {
  const critical = alerts.find((a) => a.level === "high" || a.level === "medium");
  if (!critical) return null;

  const isHigh = critical.level === "high";

  return (
    <div
      className={cn(
        "card animate-on-load relative overflow-hidden p-5 sm:p-6",
        isHigh
          ? "border-risk-high/15 bg-risk-high/[0.04]"
          : "border-risk-medium/15 bg-risk-medium/[0.04]"
      )}
    >
      <div className="relative flex gap-3.5">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 animate-pulse-soft items-center justify-center rounded-xl [animation-iteration-count:3]",
            isHigh ? "bg-risk-high/15" : "bg-risk-medium/15"
          )}
        >
          <ShieldAlert
            className={cn(
              "h-5 w-5",
              isHigh ? "text-risk-coral" : "text-risk-medium"
            )}
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-white">{critical.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-400">
            {critical.description}
          </p>
        </div>
      </div>
    </div>
  );
}
