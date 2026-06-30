"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const recommendations = [
  {
    id: "revoke",
    title: "Revoke Old Approvals",
    description: "Clean up unused contract allowances from past sessions.",
    defaultOn: true,
  },
  {
    id: "2fa",
    title: "Enable 2FA Monitoring",
    description: "Receive alerts on a secondary device for large transfers.",
    defaultOn: false,
  },
  {
    id: "dns",
    title: "Strict DNS Filtering",
    description: "Block known phishing domains at the network level.",
    defaultOn: true,
  },
];

export function SafetyRecommendations() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(recommendations.map((r) => [r.id, r.defaultOn]))
  );

  function toggle(id: string) {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div>
      <SectionHeader
        label="Security"
        title="Safety Recommendations"
        className="px-1"
      />
      <div className="card animate-on-load divide-y divide-white/[0.04] !p-0">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
          >
            <div className="min-w-0 flex-1">
              <p id={`rec-label-${rec.id}`} className="text-sm font-medium text-white">
                {rec.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                {rec.description}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={toggles[rec.id]}
              aria-labelledby={`rec-label-${rec.id}`}
              onClick={() => toggle(rec.id)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card ${
                toggles[rec.id] ? "bg-accent" : "bg-white/[0.1]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  toggles[rec.id] ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
