import type { WalletAnalysis } from "@/types/wallet";
import { DEFAULT_TX_LIMIT } from "@/lib/sui/constants";

export function SnapshotFacts({ analysis }: { analysis: WalletAnalysis }) {
  const windowSize =
    analysis.pulse?.baseline?.transactionCount ?? analysis.summary.transactionCount;
  const truncated =
    analysis.pulse?.baseline?.truncated ?? windowSize >= DEFAULT_TX_LIMIT;

  const facts = [
    { label: "First activity", value: analysis.summary.firstActivity },
    {
      label: "Window",
      value: truncated ? `${windowSize} recent txs (truncated)` : `${windowSize} recent txs`,
    },
    {
      label: "Heuristic risk",
      value: `${analysis.summary.riskLevel[0].toUpperCase()}${analysis.summary.riskLevel.slice(1)} · ${analysis.summary.riskScore}`,
    },
  ];

  return (
    <div className="card px-5 py-5">
      <p className="section-label mb-4">Snapshot</p>
      <dl className="space-y-3">
        {facts.map((fact) => (
          <div key={fact.label} className="flex items-start justify-between gap-4">
            <dt className="text-xs text-gray-500">{fact.label}</dt>
            <dd className="max-w-[60%] break-words text-right text-sm text-gray-200">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-gray-600">
        Risk score is a local heuristic, not a verdict.
      </p>
    </div>
  );
}
