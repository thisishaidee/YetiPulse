import { AlertTriangle, Info, AlertOctagon, Shield } from "lucide-react";
import type { RiskAlert, RiskLevel } from "@/types/wallet";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface RiskAlertsProps {
  alerts: RiskAlert[];
}

const levelConfig: Record<
  RiskLevel,
  { icon: typeof AlertTriangle; color: string; border: string; dot: string }
> = {
  low: {
    icon: Info,
    color: "text-risk-low",
    border: "border-l-risk-low/50",
    dot: "bg-risk-low",
  },
  medium: {
    icon: AlertTriangle,
    color: "text-risk-medium",
    border: "border-l-risk-medium/50",
    dot: "bg-risk-medium",
  },
  high: {
    icon: AlertOctagon,
    color: "text-risk-high",
    border: "border-l-risk-high/50",
    dot: "bg-risk-high",
  },
};

export function RiskAlerts({ alerts }: RiskAlertsProps) {
  const newCount = alerts.filter((a) => a.level !== "low").length;

  return (
    <div className="scroll-mt-24">
      <SectionHeader
        label="Risk Intelligence"
        title="Suspicious Alerts"
        action={
          newCount > 0 ? (
            <span className="badge bg-risk-high/10 font-mono text-[10px] uppercase tracking-wider text-risk-high">
              {newCount} New
            </span>
          ) : undefined
        }
        className="px-1"
      />

      {alerts.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Shield}
            title="No alerts detected"
            description="This wallet shows no suspicious patterns in recent activity."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, i) => {
            const config = levelConfig[alert.level];
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={cn(
                  "card border-l-2 p-4 animate-on-load sm:p-5",
                  config.border
                )}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      alert.level === "high"
                        ? "bg-risk-high/10"
                        : alert.level === "medium"
                          ? "bg-risk-medium/10"
                          : "bg-risk-low/10"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-medium text-white">{alert.title}</h3>
                      <span className="font-mono text-[10px] text-gray-600">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                      {alert.description}
                    </p>
                    <span
                      className={cn(
                        "mt-3 inline-flex items-center gap-1.5 badge border border-white/[0.06] bg-white/[0.03]",
                        config.color
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
                      {alert.level}
                    </span>
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
