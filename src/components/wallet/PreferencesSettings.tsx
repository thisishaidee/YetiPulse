"use client";

import { Bell, ShieldAlert, Moon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

const toggles = [
  {
    id: "priceAlerts",
    icon: Bell,
    title: "Price Alerts",
    description: "Get notified on significant portfolio value changes.",
    defaultOn: true,
  },
  {
    id: "riskAlerts",
    icon: ShieldAlert,
    title: "Risk & Security Alerts",
    description: "Get notified when new risk signals are detected.",
    defaultOn: true,
  },
];

export function PreferencesSettings() {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(toggles.map((t) => [t.id, t.defaultOn]))
  );

  function toggle(id: string) {
    setState((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div>
      <SectionHeader
        label="Preferences"
        title="Preferences"
        className="px-1"
      />

      <div className="card animate-on-load divide-y divide-white/[0.04] !p-0">
        {/* This release ships a single dark theme only — no light tokens
            exist anywhere in globals.css/tailwind.config.ts. A Dark/Light
            switcher (even with Light disabled) implied a feature that
            isn't there; a single static row is honest about the current
            scope instead. */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
              <Moon className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-sm font-medium text-white">Appearance</p>
          </div>
          <span className="badge border border-white/[0.06] bg-white/[0.03] font-mono text-[10px] uppercase tracking-wider text-gray-400">
            Dark Mode
          </span>
        </div>

        {toggles.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                <item.icon className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p id={`pref-label-${item.id}`} className="text-sm font-medium text-white">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={state[item.id]}
              aria-labelledby={`pref-label-${item.id}`}
              onClick={() => toggle(item.id)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card",
                state[item.id] ? "bg-accent" : "bg-white/[0.1]"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
                  state[item.id] ? "left-[22px]" : "left-0.5"
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
