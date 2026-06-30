import { Sparkles, Tag, MessageSquareText } from "lucide-react";
import type { AIExplanation } from "@/types/wallet";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface AIExplanationsProps {
  explanations: AIExplanation[];
}

export function AIExplanations({ explanations }: AIExplanationsProps) {
  return (
    <div>
      <SectionHeader
        label="AI Engine"
        title="Transaction Explanations"
        description="Plain-English breakdowns of on-chain activity"
        className="px-1"
      />

      {explanations.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={MessageSquareText}
            title="No explanations yet"
            description="Analyze a wallet with recent transactions to generate AI-powered explanations."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {explanations.map((explanation, i) => (
            <div
              key={explanation.id}
              className="card-interactive p-4 animate-on-load sm:p-5"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-gray-600">
                    {explanation.transactionDigest}
                  </span>
                  <h3 className="mt-1 font-semibold leading-snug text-white">
                    {explanation.summary}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                    {explanation.details}
                  </p>
                  {explanation.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <Tag className="h-3 w-3 shrink-0 text-gray-600" />
                      {explanation.tags.map((tag) => (
                        <span
                          key={tag}
                          className="badge border border-accent/15 bg-accent/[0.06] font-mono text-[10px] uppercase tracking-wider text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
