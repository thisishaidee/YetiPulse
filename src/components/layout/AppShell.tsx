"use client";

import { Suspense } from "react";
import { AppRail } from "@/components/layout/AppRail";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Suspense fallback={null}>
        <AppRail />
      </Suspense>
      <div className="flex min-h-screen flex-1 flex-col md:pl-[72px]">
        {children}
      </div>
    </div>
  );
}
