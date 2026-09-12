import { cn } from "@/lib/utils";
import type { WalletPulse } from "@/types/wallet";
import { getPulseStatus, statusTone } from "@/components/pulse/pulseStatus";

export function PulseStatusChip({ pulse }: { pulse?: WalletPulse }) {
  const status = getPulseStatus(pulse);
  return <span className={cn("badge", statusTone(status))}>{status}</span>;
}
