import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SHIP | 千葉県南房総市のローカル複合施設",
  description:
    "SHIPは千葉県南房総市にある複合施設です。宿泊、カフェ、BBQ、イベント・企業研修、クラフトビール醸造所など、多彩な体験をお届けします。2026年5月オープン予定。",
  keywords: ["SHIP", "南房総", "複合施設", "宿泊", "カフェ", "BBQ", "クラフトビール", "企業研修"],
  openGraph: {
    title: "SHIP | 千葉県南房総市のローカル複合施設",
    description:
      "宿泊、カフェ、BBQ、イベント・企業研修、クラフトビール醸造所。南房総の自然に包まれた複合施設。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
