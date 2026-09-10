"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="transition-opacity active:opacity-70">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/#how-it-works"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-300 active:scale-95"
          >
            How it works
          </Link>
          <Link
            href="/pulse"
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors active:scale-95",
              pathname.startsWith("/pulse")
                ? "text-white"
                : "text-gray-500 hover:text-gray-300"
            )}
          >
            Pulse
          </Link>
        </nav>

        <Link href="/#scan" className="btn-primary !rounded-full !px-5 !py-2">
          Scan a wallet
        </Link>
      </div>
    </header>
  );
}
