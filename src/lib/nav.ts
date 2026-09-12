export function withAddress(href: string, address?: string | null): string {
  if (!address || href === "/") return href;
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}address=${encodeURIComponent(address)}`;
}

export function isAppPath(pathname: string): boolean {
  return (
    pathname.startsWith("/pulse") ||
    pathname.startsWith("/portfolio") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/wallet")
  );
}
