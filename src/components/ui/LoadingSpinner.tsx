import Image from "next/image";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
  /** Shows the YetiPulse mark centered in the ring. Intended for full-page loading states only — keep off for small inline spinners. */
  brand?: boolean;
}

const sizes = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

const brandImageSizes = {
  sm: 12,
  md: 20,
  lg: 28,
};

export function LoadingSpinner({
  size = "md",
  label,
  className,
  brand = false,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            "animate-spin rounded-full border-accent/30 border-t-accent",
            sizes[size]
          )}
        />
        {brand && (
          <Image
            src="/yetipulse-mark.png"
            alt=""
            width={brandImageSizes[size]}
            height={brandImageSizes[size]}
            className="absolute rounded-full object-cover"
          />
        )}
      </div>
      {label && (
        <p className="mt-4 animate-pulse-soft text-sm text-gray-500">{label}</p>
      )}
    </div>
  );
}
