import type { Metadata } from "next";
import "./globals.css";

const siteUrl = new URL("https://hdr.kevinliu.studio");
const title = "Why LinkedIn Logos Look Brighter Than the Rest of The Page";
const description =
  "Turn ordinary images into PQ-tagged HDR highlights, compare SDR and HDR live, and learn why the effect changes across platforms.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "HDR Pop",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
