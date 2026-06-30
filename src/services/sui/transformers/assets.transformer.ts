import type { SuiObjectResponse } from "@mysten/sui/jsonRpc";
import type { OwnedAsset } from "@/types/sui";

function isCoinObject(objectType: string): boolean {
  return objectType.includes("0x2::coin::Coin");
}

function extractDisplayField(
  data: SuiObjectResponse["data"],
  field: string
): string | undefined {
  const display = data?.display?.data;
  if (!display || typeof display !== "object") return undefined;
  const value = (display as Record<string, unknown>)[field];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function extractName(data: SuiObjectResponse["data"]): string {
  const displayName = extractDisplayField(data, "name");
  if (displayName) return displayName;

  const objectType = data?.type ?? "Unknown Object";
  const parts = objectType.split("::");
  return parts[parts.length - 1] ?? "Object";
}

function isNft(objectType: string): boolean {
  const lower = objectType.toLowerCase();
  return (
    lower.includes("nft") ||
    lower.includes("kiosk") ||
    lower.includes("display") ||
    (!isCoinObject(objectType) &&
      (lower.includes("collectible") || lower.includes("art")))
  );
}

export function transformOwnedObject(obj: SuiObjectResponse): OwnedAsset | null {
  const data = obj.data;
  if (!data?.objectId || !data.type) return null;
  if (isCoinObject(data.type)) return null;

  const hasDisplay = Boolean(data.display?.data);
  const category: OwnedAsset["category"] =
    isNft(data.type) || hasDisplay ? "nft" : "object";

  return {
    id: data.objectId,
    objectType: data.type,
    category,
    name: extractName(data),
    description: extractDisplayField(data, "description"),
    imageUrl: extractDisplayField(data, "image_url"),
  };
}

export function transformOwnedObjects(
  objects: SuiObjectResponse[]
): OwnedAsset[] {
  return objects
    .map(transformOwnedObject)
    .filter((asset): asset is OwnedAsset => asset !== null);
}
