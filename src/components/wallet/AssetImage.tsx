"use client";

import { useState } from "react";
import { ImageIcon, Box } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssetImageProps {
  src: string;
  alt: string;
  category: "nft" | "object" | string;
}

/**
 * Handles the three real states an off-chain asset image goes through:
 * loading (shimmer, matches the existing .skeleton treatment), loaded
 * (fades in rather than popping in abruptly), and errored (falls back to
 * the same category icon already used when there's no imageUrl at all,
 * instead of showing a broken-image glyph).
 */
export function AssetImage({ src, alt, category }: AssetImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading"
  );

  if (status === "error") {
    return category === "nft" ? (
      <ImageIcon className="h-6 w-6 text-accent/50" />
    ) : (
      <Box className="h-6 w-6 text-gray-600" />
    );
  }

  return (
    <div className="relative h-full w-full">
      {status === "loading" && (
        <div className="skeleton absolute inset-0 !rounded-none" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300",
          status === "loaded" ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
