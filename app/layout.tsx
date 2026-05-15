import type { Metadata, Viewport } from "next";
import { Noto_Serif_JP, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-serif-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARTISM — アンチ美術批評",
  description:
    "日常の写真を現代美術批評の語彙で昇華する。著名なアーティストしか展示しない美術館への問い。あなたの写真には思想がある。",
  keywords: ["現代美術", "批評", "アンチ美術", "AI", "写真", "批評文生成"],
  authors: [{ name: "ARTISM" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ARTISM",
  },
  openGraph: {
    title: "ARTISM — アンチ美術批評",
    description: "日常の写真を現代美術批評の語彙で昇華する。",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${notoSerifJP.variable} ${cormorant.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icon/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
