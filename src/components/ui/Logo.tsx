import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md";
}

function PulseMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden>
      <rect width="36" height="36" rx="10" fill="#0B1220" />
      <rect
        x="0.5"
        y="0.5"
        width="35"
        height="35"
        rx="9.5"
        fill="none"
        stroke="rgba(124,185,255,0.28)"
      />
      <path
        d="M6 19h5.2l2.4-7.2 3.6 14.2 2.6-7H30"
        fill="none"
        stroke="#7CB9FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const boxSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <PulseMark className={cn("shrink-0", boxSize)} />
      {showText && (
        <span className="text-[15px] font-bold tracking-tight text-white min-[360px]:text-lg">
          Yeti<span className="text-accent">Pulse</span>
        </span>
      )}
    </div>
  );
}
