"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Activity, Home, Settings, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { withAddress } from "@/lib/nav";

const tabs = [
  { href: "/", label: "Home", icon: Home, match: "home" as const },
  { href: "/pulse", label: "Pulse", icon: Activity, match: "pulse" as const },
  { href: "/portfolio", label: "Portfolio", icon: Wallet, match: "portfolio" as const },
  { href: "/settings", label: "Settings", icon: Settings, match: "settings" as const },
];

export function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-surface/95 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {tabs.map((tab) => {
          const isActive =
            tab.match === "home" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={withAddress(tab.href, address)}
              className={cn(
                "relative flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-xl px-4 py-2 transition-all duration-150 active:scale-90 active:bg-white/[0.06]",
                isActive ? "text-white" : "text-gray-600"
              )}
            >
              {isActive && (
                <span className="absolute -top-0.5 h-0.5 w-5 rounded-full bg-accent" />
              )}
              <tab.icon className={cn("h-5 w-5", isActive && "text-accent")} strokeWidth={1.75} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
