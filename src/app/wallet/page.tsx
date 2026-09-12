import { redirect } from "next/navigation";

export default async function WalletPage({
  searchParams,
}: {
  searchParams: Promise<{ address?: string }>;
}) {
  const params = await searchParams;
  const address = params.address;
  redirect(address ? `/pulse?address=${encodeURIComponent(address)}` : "/pulse");
}
