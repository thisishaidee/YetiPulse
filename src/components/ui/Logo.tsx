import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const boxSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const imagePx = size === "sm" ? 32 : 36;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-accent/20",
          boxSize
        )}
      >
        <Image
          src="/yetipulse-mark.png"
          alt="YetiPulse"
          width={imagePx}
          height={imagePx}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      {showText && (
        <span className="text-[15px] font-bold tracking-tight text-white min-[360px]:text-lg">
          Yeti<span className="text-accent">Pulse</span>
        </span>
      )}
    </div>
  );
}
