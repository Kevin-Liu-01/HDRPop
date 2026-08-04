import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HDR Pop — why one LinkedIn logo looked brighter",
  description: "A short field note and interactive demo about HDR images, LinkedIn, and display-native marketing.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
