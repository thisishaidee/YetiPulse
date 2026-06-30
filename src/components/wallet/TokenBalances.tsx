import { Coins, Wallet } from "lucide-react";
import type { TokenBalance } from "@/types/sui";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface TokenBalancesProps {
  balances: TokenBalance[];
}

export function TokenBalances({ balances }: TokenBalancesProps) {
  if (balances.length === 0) {
    return (
      <div>
        <SectionHeader
          label="Portfolio"
          title="Token Balances"
          className="px-1"
        />
        <div className="card">
          <EmptyState
            icon={Wallet}
            title="No token balances"
            description="This wallet holds no coin balances on Sui mainnet."
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        label="Portfolio"
        title="Token Balances"
        description={`${balances.length} token type${balances.length !== 1 ? "s" : ""} held`}
        className="px-1"
      />

      <div className="card overflow-hidden !p-0">
        <div className="divide-y divide-white/[0.04]">
          {balances.map((balance, i) => (
            <div
              key={balance.coinType}
              className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.02] sm:px-6 animate-on-load"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Coins className="h-4 w-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight text-gray-300">
                    {balance.symbol}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-[10px] leading-tight text-gray-600">
                    {balance.coinType.length > 40
                      ? `${balance.coinType.slice(0, 20)}...${balance.coinType.slice(-12)}`
                      : balance.coinType}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-base font-semibold leading-tight text-white">
                  {balance.balance}
                </p>
                <p className="mt-0.5 text-xs leading-tight text-gray-600">
                  {balance.usdValue !== undefined
                    ? balance.usdValue.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
