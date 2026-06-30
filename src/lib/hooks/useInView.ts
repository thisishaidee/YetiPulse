"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** Fraction of the element that must be visible before it's considered "in view". */
  threshold?: number;
  /** Shrinks/grows the root bounding box, e.g. "0px 0px -80px 0px" to trigger a bit early/late. */
  rootMargin?: string;
  /** Once true, stop observing (entrance animations should only ever play once). */
  once?: boolean;
}

/**
 * Tracks whether an element has scrolled into the viewport.
 * Used to gate one-shot entrance animations (the existing `animate-on-load`
 * keyframes) so they actually play when content becomes visible, instead of
 * firing immediately on mount for content that starts off-screen.
 *
 * Respects prefers-reduced-motion by reporting "in view" immediately, so
 * motion-sensitive users see content appear without the animated transition.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isInView };
}
