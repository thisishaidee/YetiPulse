"use client";

import { useRouter } from "next/navigation";
import { WalletInput } from "@/components/ui/WalletInput";

export function AddressEmpty({
  title = "Scan a Sui wallet",
  description = "Paste an address to open a briefing. Nothing is stored and no wallet is connected.",
}: {
  title?: string;
  description?: string;
}) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center md:px-8">
      <p className="section-label">Pulse</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">{description}</p>
      <div className="mt-8 text-left">
        <WalletInput
          size="large"
          submitLabel="Scan"
          showDemo
          onSubmit={(address) => router.push(`/pulse?address=${encodeURIComponent(address)}`)}
        />
      </div>
    </div>
  );
}
