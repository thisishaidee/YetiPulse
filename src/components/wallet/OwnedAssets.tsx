import { ImageIcon, Box, Layers } from "lucide-react";
import type { OwnedAsset } from "@/types/sui";
import { truncateAddress } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AssetImage } from "@/components/wallet/AssetImage";

interface OwnedAssetsProps {
  assets: OwnedAsset[];
}

export function OwnedAssets({ assets }: OwnedAssetsProps) {
  return (
    <div>
      <SectionHeader
        label="Portfolio"
        title="Owned Assets"
        description="NFTs and objects (coins shown in balances)"
        className="px-1"
      />

      {assets.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Layers}
            title="No assets found"
            description="This wallet doesn't hold any NFTs or non-coin objects."
          />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset, i) => (
            <div
              key={asset.id}
              className="card-interactive p-3.5 animate-on-load"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06]">
                  {asset.imageUrl ? (
                    <AssetImage
                      src={asset.imageUrl}
                      alt={asset.name}
                      category={asset.category}
                    />
                  ) : asset.category === "nft" ? (
                    <ImageIcon className="h-5 w-5 text-accent/50" />
                  ) : (
                    <Box className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-sm font-medium leading-tight text-white">
                      {asset.name}
                    </h3>
                    <span
                      className={`badge shrink-0 font-mono text-[9px] uppercase tracking-wider ${
                        asset.category === "nft"
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-white/[0.04] text-gray-500"
                      }`}
                    >
                      {asset.category}
                    </span>
                  </div>
                  {asset.description && (
                    <p className="mt-1 line-clamp-2 text-xs leading-snug text-gray-600">
                      {asset.description}
                    </p>
                  )}
                  <p className="mt-1.5 font-mono text-[10px] text-gray-600">
                    {truncateAddress(asset.id, 8, 6)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
