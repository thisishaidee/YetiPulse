import {
  Skeleton,
  SkeletonRow,
  SkeletonAssetCard,
} from "@/components/ui/Skeleton";

const BAR_HEIGHTS = [45, 72, 38, 90, 55, 68, 42, 80, 60, 35, 75, 50];

function DashSkeleton() {
  return (
    <div className="space-y-8">
      {/* Wallet hero */}
      <div className="card p-6">
        <Skeleton className="mb-2 h-3 w-28" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-6 rounded-lg" />
          <Skeleton className="h-6 w-6 rounded-lg" />
        </div>
        <Skeleton className="mt-4 h-10 w-48" />
        <div className="mt-4 flex gap-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>

      {/* AI Profile card */}
      <div className="card p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="mt-2 h-3.5 w-5/6" />
        <Skeleton className="mt-2 h-3.5 w-2/3" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>

      {/* Activity chart */}
      <div className="card p-6">
        <Skeleton className="mb-6 h-4 w-32" />
        <div className="flex h-32 items-end gap-2">
          {BAR_HEIGHTS.map((h, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-t-md"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card-interactive p-5">
            <div className="flex items-start justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="mt-2 h-8 w-20" />
            <Skeleton className="mt-1.5 h-3 w-14" />
          </div>
        ))}
        <div className="card-interactive col-span-2 flex items-center justify-between p-5">
          <div>
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-1 h-8 w-16" />
          </div>
          <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
        </div>
      </div>

      {/* Token balances */}
      <div>
        <Skeleton className="mb-1.5 h-3 w-20" />
        <Skeleton className="mb-5 h-5 w-36" />
        <div className="card divide-y divide-white/[0.04] overflow-hidden !p-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-5 sm:px-6">
              <SkeletonRow />
            </div>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <div className="card overflow-hidden !p-0">
        <div className="border-b border-white/[0.06] px-5 py-5 sm:px-6">
          <Skeleton className="mb-1.5 h-3 w-16" />
          <Skeleton className="h-5 w-32" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-7 w-14 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-14 rounded-full" />
          </div>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-5 sm:px-6">
              <SkeletonRow />
            </div>
          ))}
        </div>
      </div>

      {/* Owned assets */}
      <div>
        <Skeleton className="mb-1.5 h-3 w-20" />
        <Skeleton className="mb-5 h-5 w-32" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonAssetCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RiskSkeleton() {
  return (
    <div className="space-y-8">
      {/* Safety score ring */}
      <div className="flex flex-col items-center py-4">
        <Skeleton className="h-[220px] w-[220px] rounded-full sm:h-60 sm:w-60" />
      </div>

      {/* Critical alert banner */}
      <div className="card p-5 sm:p-6">
        <div className="flex gap-3.5">
          <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="mt-2 h-3.5 w-full" />
            <Skeleton className="mt-1.5 h-3.5 w-4/5" />
          </div>
        </div>
      </div>

      {/* Risk alerts list */}
      <div>
        <Skeleton className="mb-1.5 h-3 w-24" />
        <Skeleton className="mb-5 h-5 w-40" />
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="mt-2 h-3.5 w-full" />
                  <Skeleton className="mt-1.5 h-3.5 w-3/4" />
                  <Skeleton className="mt-3 h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety recommendations */}
      <div>
        <Skeleton className="mb-1.5 h-3 w-20" />
        <Skeleton className="mb-5 h-5 w-44" />
        <div className="card divide-y divide-white/[0.04] !p-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <div className="flex-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="mt-1.5 h-3 w-full" />
              </div>
              <Skeleton className="h-6 w-11 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Account */}
      <div>
        <Skeleton className="mb-1.5 h-3 w-20" />
        <Skeleton className="mb-5 h-5 w-36" />
        <div className="card divide-y divide-white/[0.04] !p-0">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="mt-1 h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div>
        <Skeleton className="mb-1.5 h-3 w-24" />
        <Skeleton className="mb-5 h-5 w-32" />
        <div className="card divide-y divide-white/[0.04] !p-0">
          <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-28 rounded-lg" />
          </div>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="mt-1 h-3 w-44" />
                </div>
              </div>
              <Skeleton className="h-6 w-11 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Network */}
      <div>
        <Skeleton className="mb-1.5 h-3 w-24" />
        <Skeleton className="mb-5 h-5 w-28" />
        <div className="card divide-y divide-white/[0.04] !p-0">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-1 h-3 w-36" />
                </div>
              </div>
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          ))}
          <div className="px-5 py-3.5 sm:px-6">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="mt-1.5 h-3.5 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface DashboardSkeletonProps {
  view?: "dash" | "risk" | "settings";
}

export function DashboardSkeleton({ view = "dash" }: DashboardSkeletonProps) {
  return (
    <div className="animate-fade-in">
      {/* Mobile: render only the active view's skeleton */}
      <div className="md:hidden">
        {view === "dash" && <DashSkeleton />}
        {view === "risk" && <RiskSkeleton />}
        {view === "settings" && <SettingsSkeleton />}
      </div>

      {/* Desktop: render all three panels (they're all visible) */}
      <div className="hidden md:block space-y-8">
        <DashSkeleton />
        <RiskSkeleton />
        <SettingsSkeleton />
      </div>
    </div>
  );
}
