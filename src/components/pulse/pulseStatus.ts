import type { PulseSeverity, WalletPulse } from "@/types/wallet";

export type PulseStatus = "Quiet" | "Urgent" | "Notable" | "Watch";

export function getPulseStatus(pulse?: WalletPulse): PulseStatus {
  const events = pulse?.events ?? [];
  if (events.length === 0) return "Quiet";
  if (events.some((event) => event.severity === "urgent")) return "Urgent";
  if (events.some((event) => event.severity === "notable")) return "Notable";
  return "Watch";
}

export function statusTone(status: PulseStatus): string {
  switch (status) {
    case "Urgent":
      return "bg-risk-high/10 text-risk-high";
    case "Notable":
      return "bg-risk-medium/10 text-risk-medium";
    case "Watch":
      return "bg-accent/10 text-accent";
    default:
      return "bg-risk-low/10 text-risk-low";
  }
}

export function severityStripe(severity: PulseSeverity): string {
  switch (severity) {
    case "urgent":
      return "bg-risk-high";
    case "notable":
      return "bg-risk-medium";
    default:
      return "bg-accent";
  }
}
