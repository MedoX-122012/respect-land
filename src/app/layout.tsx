import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Respect Land | موطن صناع المحتوى",
    template: "%s | Respect Land",
  },
  description:
    "مكان واحد يجمع صناع المحتوى المميزين في مجتمع Respect Land. اكتشف صناع المحتوى، التصنيفات، والمتصدرين.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    siteName: "Respect Land",
    locale: "ar_EG",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F0D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${inter.variable} ${ibmPlexSansArabic.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-brand-bg text-brand-text font-sans antialiased">
        <Toaster>{children}</Toaster>
      </body>
    </html>
  );
}