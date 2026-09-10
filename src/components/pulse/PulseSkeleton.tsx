import { Skeleton } from "@/components/ui/Skeleton";

export function PulseSkeleton() {
  return (
    <div className="mx-auto max-w-[1120px] space-y-8 px-4 py-8 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="space-y-2 md:text-right">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <div className="card grid grid-cols-2 gap-px overflow-hidden !p-0 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-surface-card px-5 py-5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-3 h-6 w-20" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <div className="card space-y-4 p-5">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

export function PortfolioSkeleton() {
  return (
    <div className="mx-auto max-w-[1120px] space-y-10 px-4 py-8 md:px-8">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-48" />
      </div>
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  );
}
