"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { AppShell } from "@/components/layout/AppShell";
import { isAppPath } from "@/lib/nav";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const app = isAppPath(pathname);

  if (!app) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <AppShell>
        <main className="flex-1 pb-28 md:pb-0">{children}</main>
      </AppShell>
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
    </>
  );
}
