"use client";

import { useState } from "react";
import type { PulseEvent } from "@/types/wallet";
import { PulseEventCard } from "@/components/pulse/PulseEventCard";
import { PulseEmpty } from "@/components/pulse/PulseEmpty";

export function PulseFeed({
  events,
  engineReady,
  selectedId,
  onSelect,
}: {
  events: PulseEvent[];
  engineReady: boolean;
  selectedId?: string;
  onSelect?: (event: PulseEvent) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(events[0]?.id ?? null);

  if (events.length === 0) {
    return <PulseEmpty engineReady={engineReady} />;
  }

  return (
    <div className="card overflow-hidden !p-0">
      {events.map((event) => {
        const open = openId === event.id;
        return (
          <div key={event.id} className="border-b border-white/[0.04] last:border-b-0">
            <PulseEventCard
              event={event}
              selected={selectedId === event.id || open}
              onSelect={(next) => {
                setOpenId((current) => (current === next.id ? null : next.id));
                onSelect?.(next);
              }}
            />
            {open && (
              <div className="px-5 pb-4 sm:hidden">
                {event.whyItMatters && <p className="text-sm text-gray-500">{event.whyItMatters}</p>}
                {event.action && <p className="mt-2 text-sm text-accent">{event.action}</p>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
