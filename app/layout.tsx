import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://shogo-one.vercel.app"),
  title: "田口 将伍 — ポートフォリオ",
  description: "Flutter・SwiftUIを中心に、企画・開発・公開・改善まで手がける田口将伍のポートフォリオ。StriveとGuruMeetの制作実績を紹介。",
  authors: [{ name: "Shogo Taguchi", url: "https://github.com/jcm2bd9rn5-cyber" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "田口 将伍 — ポートフォリオ",
    description: "個人開発をしています。",
    type: "website",
    locale: "ja_JP",
    images: [{ url: "/images/strive-ogp.jpg", width: 1200, height: 630, alt: "田口将伍のポートフォリオ" }],
  },
  twitter: { card: "summary_large_image", title: "田口 将伍 — ポートフォリオ", images: ["/images/strive-ogp.jpg"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050404",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
