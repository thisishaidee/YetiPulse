"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

function WalletRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const address = searchParams.get("address");
    router.replace(
      address ? `/pulse?address=${encodeURIComponent(address)}` : "/pulse"
    );
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner label="Opening Pulse..." brand />
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner label="Opening Pulse..." brand />
        </div>
      }
    >
      <WalletRedirect />
    </Suspense>
  );
}
