import { cn } from "@/lib/utils";
import type { PulseEvent } from "@/types/wallet";
import { severityStripe } from "@/components/pulse/pulseStatus";

export function PulseEventCard({
  event,
  selected = false,
  onSelect,
}: {
  event: PulseEvent;
  selected?: boolean;
  onSelect?: (event: PulseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(event)}
      className={cn(
        "flex w-full gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02] sm:px-6",
        selected && "bg-accent/[0.04]"
      )}
    >
      <span className={cn("mt-1 h-10 w-0.5 shrink-0 rounded-full", severityStripe(event.severity))} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-gray-200">{event.title}</p>
          {event.amount && (
            <p className="shrink-0 font-mono text-sm font-semibold tabular-nums text-gray-300">{event.amount}</p>
          )}
        </div>
        {(event.whatChanged || event.body) && (
          <p className="mt-1 text-sm text-gray-400">{event.whatChanged || event.body}</p>
        )}
        {event.whyUnusual && <p className="mt-1 text-sm text-gray-500">{event.whyUnusual}</p>}
        {event.time && <p className="mt-2 font-mono text-[11px] text-gray-600">{event.time}</p>}
      </div>
    </button>
  );
}
