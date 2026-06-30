"use client";



import { useRouter } from "next/navigation";

import { ScanLine } from "lucide-react";

import { WalletInput } from "@/components/ui/WalletInput";



export function Hero() {

  const router = useRouter();



  function handleAnalyze(address: string) {

    router.push(`/wallet?address=${encodeURIComponent(address)}`);

  }



  return (

    <section className="relative overflow-hidden">

      <div className="absolute inset-0 bg-hero-glow" />

      <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-60" />



      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-6 sm:pt-20 lg:pb-20">

        <div className="mx-auto max-w-3xl text-center">

          <div className="animate-on-load stagger-1 mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5">

            <span className="relative flex h-2 w-2">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-risk-low opacity-60" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-risk-low" />

            </span>

            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-gray-400">

              Sui Network Live

            </span>

          </div>



          <h1 className="animate-on-load stagger-2 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">

            Blockchain Intelligence,{" "}

            <span className="bg-gradient-to-r from-accent to-sui bg-clip-text text-transparent">

              Deciphered.

            </span>

          </h1>



          <p className="animate-on-load stagger-3 mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">

            Navigate the complexity of Web3 with institutional-grade insights

            and human-readable data on the Sui network.

          </p>



          <div className="animate-on-load stagger-4 mx-auto mt-10 max-w-xl">

            <WalletInput

              onSubmit={handleAnalyze}

              size="large"

              submitLabel="Scan Wallet"

              submitIcon={ScanLine}

            />

          </div>



          <p className="animate-on-load stagger-5 mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-600">

            Institutional Trust · Official Sui RPC · Real-time Analysis

          </p>

        </div>

      </div>

    </section>

  );

}


