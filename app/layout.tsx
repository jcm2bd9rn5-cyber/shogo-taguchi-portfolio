import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shogo-one.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "田口 将伍 | ポートフォリオ",
  description: "田口将伍の個人開発ポートフォリオ。StriveとGuruMeetを紹介しています。",
  authors: [{ name: "Shogo Taguchi", url: "https://github.com/jcm2bd9rn5-cyber" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "田口 将伍 | ポートフォリオ",
    description: "個人開発の制作物を紹介しています。",
    type: "website",
    locale: "ja_JP",
    siteName: "田口 将伍 | ポートフォリオ",
  },
  twitter: { card: "summary" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050404",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja" className={`${sans.variable} ${mono.variable}`}><body>{children}</body></html>;
}
