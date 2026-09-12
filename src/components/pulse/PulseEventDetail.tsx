import type { PulseEvent } from "@/types/wallet";
import { cn } from "@/lib/utils";
import { severityStripe } from "@/components/pulse/pulseStatus";

export function PulseEventDetail({ event }: { event: PulseEvent | null }) {
  if (!event) {
    return (
      <div className="card px-5 py-5">
        <p className="section-label">Detail</p>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">Select an event to read why it was flagged.</p>
      </div>
    );
  }

  const digest = event.evidence?.digest;

  return (
    <div className="card px-5 py-5">
      <div className="flex items-start gap-3">
        <span className={cn("mt-1 h-8 w-0.5 shrink-0 rounded-full", severityStripe(event.severity))} aria-hidden />
        <div className="min-w-0">
          <p className="section-label">{event.kind.replaceAll("_", " ")}</p>
          <h3 className="mt-1 text-sm font-medium text-white">{event.title}</h3>
        </div>
      </div>
      <dl className="mt-4 space-y-3 text-sm">
        {event.whatChanged && (
          <div>
            <dt className="text-xs text-gray-600">What changed</dt>
            <dd className="mt-1 text-gray-300">{event.whatChanged}</dd>
          </div>
        )}
        {event.whyUnusual && (
          <div>
            <dt className="text-xs text-gray-600">Why unusual</dt>
            <dd className="mt-1 text-gray-300">{event.whyUnusual}</dd>
          </div>
        )}
        {event.whyItMatters && (
          <div>
            <dt className="text-xs text-gray-600">Why it matters</dt>
            <dd className="mt-1 text-gray-300">{event.whyItMatters}</dd>
          </div>
        )}
        {event.body && !event.whatChanged && <p className="text-gray-300">{event.body}</p>}
      </dl>
      {event.action && <p className="mt-4 text-sm text-accent">{event.action}</p>}
      {digest && (
        <a href={`https://suiscan.xyz/mainnet/tx/${digest}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-mono text-[11px] text-gray-500 hover:text-accent">
          {digest}
        </a>
      )}
    </div>
  );
}
