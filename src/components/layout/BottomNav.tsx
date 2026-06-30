"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, LayoutDashboard, Shield, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home, match: "home" as const, hash: "" },
  { href: "/wallet", label: "Dash", icon: LayoutDashboard, match: "dash" as const, hash: "" },
  { href: "/wallet#risk", label: "Risk", icon: Shield, match: "risk" as const, hash: "#risk" },
  { href: "/wallet#settings", label: "Settings", icon: Settings, match: "settings" as const, hash: "#settings" },
];

function getActiveTab(pathname: string, hash: string) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/wallet")) {
    if (hash === "#risk") return "risk";
    if (hash === "#settings") return "settings";
    return "dash";
  }
  return "";
}

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(window.location.hash);
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
    };
  }, [pathname]);

  const active = getActiveTab(pathname, hash);

  function handleTabClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    tab: (typeof tabs)[number]
  ) {
    // Next.js <Link> can update a hash-only URL (same pathname, different
    // hash) via history.pushState without firing a native 'hashchange'
    // event. That left the page's view state stale until a real pathname
    // change (e.g. tapping Home) forced a remount. Here we drive the
    // navigation ourselves so the hash is always set explicitly and a
    // 'hashchange' event always fires, regardless of Next's internal
    // transition behavior for same-pathname hash links.
    if (pathname.startsWith("/wallet") && tab.match !== "home") {
      e.preventDefault();
      const newHash = tab.hash;

      if (window.location.hash !== newHash) {
        // pushState + manual dispatch guarantees listeners relying on
        // 'hashchange' (here and in wallet/page.tsx) always fire.
        window.history.pushState(null, "", `/wallet${newHash}`);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
      setHash(newHash);
      return;
    }

    // Not currently on /wallet (e.g. on Home tapping Dash/Risk/Settings),
    // or the Home tab itself — let Next.js's router handle the normal
    // cross-page navigation.
    router.push(tab.href);
    e.preventDefault();
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-surface/95 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {tabs.map((tab) => {
          const isActive = active === tab.match;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={(e) => handleTabClick(e, tab)}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all duration-150 active:scale-90 active:bg-white/[0.06]",
                isActive ? "text-white" : "text-gray-600"
              )}
            >
              {isActive && (
                <span className="absolute -top-0.5 h-0.5 w-5 rounded-full bg-accent" />
              )}
              <tab.icon className={cn("h-5 w-5", isActive && "text-accent")} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
