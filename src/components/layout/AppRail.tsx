"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Activity, Home, Settings, Wallet } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { withAddress } from "@/lib/nav";

const items = [
  { href: "/", label: "Home", icon: Home, match: "home" },
  { href: "/pulse", label: "Pulse", icon: Activity, match: "pulse" },
  { href: "/portfolio", label: "Portfolio", icon: Wallet, match: "portfolio" },
  { href: "/settings", label: "Settings", icon: Settings, match: "settings" },
] as const;

export function AppRail() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[72px] flex-col border-r border-white/[0.06] bg-surface-raised md:flex">
      <div className="flex h-16 items-center justify-center">
        <Link href="/" aria-label="YetiPulse home" className="active:opacity-70">
          <Logo showText={false} size="sm" />
        </Link>
      </div>
      <nav className="mt-8 flex flex-col items-center gap-2">
        {items.map((item) => {
          const active =
            item.match === "home"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={withAddress(item.href, address)}
              aria-label={item.label}
              title={item.label}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-white/[0.05]",
                active ? "text-accent" : "text-gray-600 hover:text-gray-300"
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={1.75} />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
