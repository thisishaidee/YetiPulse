import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YetiPulse: What matters about this wallet right now",
  description:
    "Paste a Sui address. YetiPulse reads live on chain activity and turns it into a short briefing.",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "YetiPulse: What matters about this wallet right now",
    description:
      "Paste a Sui address. YetiPulse reads live on chain activity and turns it into a short briefing.",
    images: [{ url: "/icon-512.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "YetiPulse: What matters about this wallet right now",
    description:
      "Paste a Sui address. YetiPulse reads live on chain activity and turns it into a short briefing.",
    images: ["/icon-512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans`}
      >
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
