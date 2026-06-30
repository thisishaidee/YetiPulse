export function TrustBar() {
  return (
    <section className="border-y border-white/[0.06] bg-surface-raised/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 px-4 py-5 sm:flex-row sm:gap-6 sm:px-6">
        <span className="section-label">Institutional Trust</span>
        <p className="text-center text-sm text-gray-500">
          Real-time analysis powered by{" "}
          <span className="font-medium text-accent">official Sui RPC</span>{" "}
          endpoints
        </p>
      </div>
    </section>
  );
}
