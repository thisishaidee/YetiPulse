"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/wallet", label: "Dashboard" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="transition-opacity active:opacity-70">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : link.href.startsWith("/wallet")
                  ? pathname.startsWith("/wallet")
                  : false;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors active:scale-95",
                  isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/wallet"
          className="btn-primary !rounded-full !px-5 !py-2"
        >
          Analyze
        </Link>
      </div>
    </header>
  );
}
