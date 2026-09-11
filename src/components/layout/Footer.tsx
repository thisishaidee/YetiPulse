import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface-raised">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-500">
              A quiet Sui briefing. Paste an address, read what changed in the recent window, then inspect the evidence.
            </p>
          </div>
          <div>
            <p className="section-label mb-4">Network</p>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li>
                <a href="https://suiscan.xyz" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">Suiscan</a>
              </li>
              <li>
                <a href="https://sui.io" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">Sui Network</a>
              </li>
            </ul>
          </div>
          <div>
            <p className="section-label mb-4">Product</p>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li>
                <Link href="/#how-it-works" className="transition-colors hover:text-accent">How it works</Link>
              </li>
              <li>
                <Link href="/pulse" className="transition-colors hover:text-accent">Pulse</Link>
              </li>
              <li>
                <Link href="/#scan" className="transition-colors hover:text-accent">Scan a wallet</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="font-mono text-[11px] uppercase tracking-wider text-gray-600">
            © {new Date().getFullYear()} YetiPulse
          </p>
          <p className="font-mono text-[11px] text-gray-600">Official Sui RPC · read only snapshot</p>
        </div>
      </div>
    </footer>
  );
}
