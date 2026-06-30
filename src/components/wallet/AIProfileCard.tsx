"use client";

import { Sparkles, BrainCircuit } from "lucide-react";
import type { AIExplanation } from "@/types/wallet";

interface AIProfileCardProps {
  explanations: AIExplanation[];
  transactionCount: number;
}

export function AIProfileCard({
  explanations,
  transactionCount,
}: AIProfileCardProps) {
  const profileText =
    explanations.length > 0
      ? explanations[0].details.replace(" [Placeholder AI response]", "")
      : transactionCount > 0
        ? `This wallet has ${transactionCount} recent transactions on Sui mainnet. Analyze individual activity below for detailed AI explanations.`
        : "No recent activity detected. Enter an active wallet address to generate a behavioral profile.";

  const tags = [
    "Sui Mainnet",
    explanations.length > 0 ? "AI Analyzed" : "Awaiting Data",
    transactionCount > 5 ? "Active User" : "Low Activity",
  ];

  return (
    <div className="card-interactive animate-on-load stagger-2 p-5 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <p className="section-label text-accent">AI Behavioral Profile</p>
        </div>
        <BrainCircuit className="h-4 w-4 text-gray-600" />
      </div>

      <p className="text-sm leading-relaxed text-gray-300">{profileText}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="badge border border-white/[0.1] font-mono text-[10px] uppercase tracking-wider text-gray-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
