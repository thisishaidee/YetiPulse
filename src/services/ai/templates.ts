import type { ExplanationResult, ParsedTransaction } from "./types";

function withFailureNote(summary: string, parsed: ParsedTransaction): string {
  if (parsed.status === "failed") {
    return `${summary.replace(/\.$/, "")}, but the transaction failed.`;
  }
  return summary.endsWith(".") ? summary : `${summary}.`;
}

function primaryChange(parsed: ParsedTransaction) {
  return parsed.balanceChanges[0];
}

function buildTags(parsed: ParsedTransaction, extra: string[] = []): string[] {
  const tags = new Set<string>([
    parsed.activity,
    parsed.status,
    ...extra,
  ]);

  for (const change of parsed.balanceChanges) {
    tags.add(change.symbol.toLowerCase());
  }

  return Array.from(tags);
}

function buildContractDetails(parsed: ParsedTransaction): string {
  if (parsed.contractCalls.length === 0) {
    return "This transaction invoked on-chain program logic. No token balance changes were detected for your wallet.";
  }

  const calls = parsed.contractCalls
    .slice(0, 3)
    .map((call) => `${call.module}::${call.function}`)
    .join(", ");

  return `Your wallet interacted with smart contract functions (${calls}). This is a placeholder explanation — a live AI model will provide deeper context later.`;
}

/** Placeholder template responses until a real LLM provider is connected. */
export function generatePlaceholderExplanation(
  parsed: ParsedTransaction
): ExplanationResult {
  switch (parsed.activity) {
    case "receive": {
      const change = primaryChange(parsed);
      const amount = change?.amount ?? "tokens";
      const symbol = change?.symbol ?? "SUI";
      const summary = withFailureNote(
        `You received ${amount} ${symbol}`,
        parsed
      );
      return {
        summary,
        details: `${summary} Funds were deposited into your wallet${parsed.sender ? ` from ${parsed.sender.slice(0, 6)}...${parsed.sender.slice(-4)}` : ""}. [Placeholder AI response]`,
        tags: buildTags(parsed, ["incoming", "transfer"]),
        activity: parsed.activity,
      };
    }

    case "send": {
      const change = primaryChange(parsed);
      const amount = change?.amount ?? "tokens";
      const symbol = change?.symbol ?? "SUI";
      const summary = withFailureNote(`You sent ${amount} ${symbol}`, parsed);
      return {
        summary,
        details: `${summary} This was an outgoing transfer from your wallet. [Placeholder AI response]`,
        tags: buildTags(parsed, ["outgoing", "transfer"]),
        activity: parsed.activity,
      };
    }

    case "swap": {
      const { swap } = parsed;
      const summary = swap
        ? withFailureNote(
            `You swapped ${swap.from.amount} ${swap.from.symbol} for ${swap.to.amount} ${swap.to.symbol}`,
            parsed
          )
        : withFailureNote("You swapped tokens on a decentralized exchange", parsed);

      const protocol = swap?.protocol ? ` via ${swap.protocol}` : "";
      return {
        summary,
        details: `${summary}${protocol}. Token swaps exchange one asset for another on-chain. [Placeholder AI response]`,
        tags: buildTags(parsed, ["defi", "dex", "swap"]),
        activity: parsed.activity,
      };
    }

    case "stake": {
      const change =
        parsed.balanceChanges.find((c) => c.direction === "out") ??
        primaryChange(parsed);
      const amount = change?.amount ?? "tokens";
      const symbol = change?.symbol ?? "SUI";
      const summary = withFailureNote(
        `You staked ${amount} ${symbol}`,
        parsed
      );
      return {
        summary,
        details: `${summary} Staked tokens are delegated to a validator to earn rewards. [Placeholder AI response]`,
        tags: buildTags(parsed, ["staking", "yield"]),
        activity: parsed.activity,
      };
    }

    case "nft": {
      const summary = withFailureNote(
        "You transferred or acquired an NFT or digital object",
        parsed
      );
      return {
        summary,
        details: `${summary} This transaction involved a non-fungible token or Sui object. [Placeholder AI response]`,
        tags: buildTags(parsed, ["nft", "object"]),
        activity: parsed.activity,
      };
    }

    case "contract_interaction": {
      const summary = withFailureNote(
        "You interacted with a smart contract",
        parsed
      );
      return {
        summary,
        details: buildContractDetails(parsed),
        tags: buildTags(parsed, ["smart-contract", "move"]),
        activity: parsed.activity,
      };
    }

    default: {
      const summary = withFailureNote(
        "Wallet activity was recorded on-chain",
        parsed
      );
      return {
        summary,
        details: `${summary} We could not classify this transaction into a common pattern. [Placeholder AI response]`,
        tags: buildTags(parsed),
        activity: parsed.activity,
      };
    }
  }
}
