"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { WalletInput } from "@/components/ui/WalletInput";

interface AppHeaderProps {
  title: string;
  showInput?: boolean;
}

function AppHeaderInner({ title, showInput = true }: AppHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const address = searchParams.get("address") ?? "";

  function handleAnalyze(next: string) {
    router.push(`/pulse?address=${encodeURIComponent(next)}`);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-surface/90 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex items-center gap-2.5">
          <div className="md:hidden">
            <Logo showText={false} size="sm" />
          </div>
          <h1 className="text-sm font-medium text-gray-400">{title}</h1>
          {title === "Pulse" && <span className="h-1.5 w-1.5 rounded-full bg-risk-low" aria-hidden />}
        </div>
        {showInput && (
          <div className="hidden min-w-0 max-w-md flex-1 md:block">
            <WalletInput
              key={address}
              onSubmit={handleAnalyze}
              initialValue={address}
              showDemo={false}
              submitLabel="Scan"
            />
          </div>
        )}
      </div>
    </header>
  );
}

export function AppHeader(props: AppHeaderProps) {
  return (
    <Suspense fallback={<header className="sticky top-0 z-30 h-14 border-b border-white/[0.06] bg-surface/90" />}>
      <AppHeaderInner {...props} />
    </Suspense>
  );
}
