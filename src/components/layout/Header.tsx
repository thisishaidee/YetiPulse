"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="min-w-0 transition-opacity active:opacity-70">
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
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-300 active:scale-95"
          >
            Pulse
          </Link>
        </nav>
        <Link href="/#scan" className="btn-primary shrink-0 !min-h-11 !rounded-full !px-4 !py-2 sm:!px-5">
          <span className="max-[360px]:hidden">Scan a wallet</span>
          <span className="min-[361px]:hidden">Scan</span>
        </Link>
      </div>
    </header>
  );
}
