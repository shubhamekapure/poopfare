import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PoopBackground } from "@/components/PoopBackground";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://poopfare.com",
  ),
  title: "PoopFare — The World's First Poop Charity",
  description:
    "Because the world's worst deserve your worst. Allocate your daily poop to humanity's most deserving targets.",
  manifest: "/manifest.json",
  openGraph: {
    title: "PoopFare — Make your poop count.",
    description: "Fantasy Football for public humiliation, powered by your daily 💩 allowance.",
    siteName: "PoopFare",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    title: "PoopFare",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#78350f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="poop-bg flex min-h-full flex-col text-stone-900">
        <PoopBackground />
        <Header />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
