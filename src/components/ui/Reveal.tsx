"use client";

import type { ReactNode } from "react";
import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Matches the existing .stagger-1 .. .stagger-6 delay utilities in globals.css */
  delay?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: "div" | "section";
}

/**
 * Plays the existing slide-up entrance animation when the element scrolls
 * into view, instead of immediately on mount. Content starts at opacity-0
 * (matching .animate-on-load) and only gets the animate class once visible,
 * so below-the-fold sections don't silently finish animating off-screen.
 */
export function Reveal({ children, className, delay, as = "div" }: RevealProps) {
  const { ref, isInView } = useInView();
  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "opacity-0",
        isInView && `animate-slide-up${delay ? ` stagger-${delay}` : ""}`,
        className
      )}
    >
      {children}
    </Tag>
  );
}
