const facts = [
  "Read only. We never ask you to connect a wallet.",
  "Data from official Sui RPC.",
  "Recent activity is a snapshot, not lifetime history.",
] as const;

export function LandingTrust() {
  return (
    <section className="landing-rise-soft border-t border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-6 text-left sm:grid-cols-3">
        {facts.map((fact) => (
          <p key={fact} className="text-sm leading-relaxed text-gray-500">{fact}</p>
        ))}
      </div>
    </section>
  );
}
