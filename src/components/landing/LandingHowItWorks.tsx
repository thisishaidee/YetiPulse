const steps = [
  {
    n: "01",
    title: "Enter a Sui address",
    body: "Any 0x address. Read-only.",
  },
  {
    n: "02",
    title: "Scan live chain data",
    body: "Balances, recent transactions, and objects from official Sui RPC.",
  },
  {
    n: "03",
    title: "Read the Pulse",
    body: "A short briefing of what changed in the recent window.",
  },
  {
    n: "04",
    title: "Inspect the evidence",
    body: "Full recent history, tokens, and assets when you want the ledger.",
  },
] as const;

export function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="landing-rise scroll-mt-24 border-t border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <p className="section-label mb-2">Method</p>
        <h2 className="section-title text-2xl sm:text-3xl">How it works</h2>
        <div className="mt-10 grid gap-0 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/[0.06]">
          {steps.map((step) => (
            <div key={step.n} className="border-t border-white/[0.06] py-6 lg:border-t-0 lg:px-6 lg:first:pl-0 lg:last:pr-0">
              <p className="font-mono text-xs text-gray-600">{step.n}</p>
              <h3 className="mt-3 font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
