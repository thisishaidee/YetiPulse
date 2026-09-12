export function PulseEmpty({ engineReady }: { engineReady: boolean }) {
  return (
    <div className="card px-5 py-8 sm:px-6">
      <p className="text-sm font-medium text-gray-200">
        {engineReady ? "No unusual activity in this window." : "No Pulse events yet."}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">
        {engineReady
          ? "Nothing in the recent snapshot stood out from this wallet's usual pattern."
          : "Quiet is a valid result. Recent activity below is the evidence for this snapshot."}
      </p>
    </div>
  );
}
