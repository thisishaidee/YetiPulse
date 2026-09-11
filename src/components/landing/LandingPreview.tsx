const kpis = [
  { label: "Net worth", value: "$12,480" },
  { label: "Transactions", value: "25" },
  { label: "Tokens", value: "6" },
  { label: "Last activity", value: "2h ago" },
] as const;

const events = [
  {
    title: "Large outbound transfer",
    amount: "-1,200 SUI",
    why: "Several times larger than recent sends.",
    tone: "notable" as const,
  },
  {
    title: "New counterparty",
    amount: "-48 SUI",
    why: "First payment to this address in the window.",
    tone: "info" as const,
  },
] as const;

const stripe = {
  notable: "bg-risk-medium",
  info: "bg-accent",
} as const;

export function LandingPreview() {
  return (
    <section className="flex items-center px-4 py-12 sm:px-6 sm:py-16 md:min-h-[calc(100vh-88px)] md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <p className="section-label">Preview</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          A briefing, not a spreadsheet
        </h2>
        <div className="card mt-8 overflow-hidden !p-0">
          <div className="flex flex-col gap-3 border-b border-white/[0.06] px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div>
              <p className="section-label">Active wallet</p>
              <p className="mt-1 font-mono text-sm font-medium text-accent">0x1e63fe…33aa64</p>
            </div>
            <div className="sm:text-right">
              <p className="text-2xl font-bold tabular-nums text-white sm:text-3xl">$12,480</p>
              <p className="mt-1 text-sm text-gray-500">4,210 SUI · Quiet</p>
            </div>
          </div>
          <div className="grid grid-cols-2 border-b border-white/[0.06] md:grid-cols-4 md:divide-x md:divide-white/[0.06]">
            {kpis.map((kpi, index) => (
              <div
                key={kpi.label}
                className={`flex min-h-[88px] flex-col justify-between px-4 py-4 sm:px-6 ${index < 2 ? "border-b border-white/[0.06] md:border-b-0" : ""} ${index % 2 === 0 ? "border-r border-white/[0.06] md:border-r-0" : ""}`}
              >
                <p className="section-label">{kpi.label}</p>
                <p className="mt-3 truncate text-lg font-bold leading-none tabular-nums text-white sm:text-xl md:text-2xl">{kpi.value}</p>
              </div>
            ))}
          </div>
          <div className="divide-y divide-white/[0.04]">
            {events.map((event) => (
              <div key={event.title} className="flex gap-4 px-5 py-4 sm:px-6">
                <span className={`mt-1 h-10 w-0.5 shrink-0 rounded-full ${stripe[event.tone]}`} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-gray-200">{event.title}</p>
                    <p className="shrink-0 font-mono text-sm font-semibold tabular-nums text-gray-300">{event.amount}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{event.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-600">Preview of Pulse. Live results depend on the address you scan.</p>
      </div>
    </section>
  );
}
