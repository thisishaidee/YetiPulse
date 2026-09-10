import { DEFAULT_TX_LIMIT } from "@/lib/sui/constants";
import type { WalletAnalysis } from "@/types/wallet";

export function PulseBaselineNote({ analysis }: { analysis: WalletAnalysis }) {
  const count =
    analysis.pulse?.baseline?.transactionCount ?? analysis.summary.transactionCount;
  const truncated =
    analysis.pulse?.baseline?.truncated ?? count >= DEFAULT_TX_LIMIT;

  return (
    <p className="mt-3 text-xs leading-relaxed text-gray-600">
      Based on the last {count} transactions. This is a snapshot, not lifetime history.
      {truncated ? " Window truncated." : ""}
    </p>
  );
}
