import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://teluguvoice.vercel.app"),
  title: {
    template: "%s | Telugu Voice",
    default: "Telugu Voice - Premium Telugu Content Hub",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "mask-icon",
      url: "/favicon.svg",
      color: "#0c1b33",
    },
  },
  description:
    "Your premier destination for Telugu audiobooks, spiritual content, and knowledge sharing. Featuring Shadow Madhubabu, Voice of Maheedhar, and Facts Hive.",
  keywords:
    "Telugu content, Telugu audiobooks, Telugu spiritual content, Telugu knowledge sharing, Telugu Voice",
  authors: [{ name: "Telugu Voice" }],
  creator: "Telugu Voice",
  publisher: "Telugu Voice",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "te_IN",
    url: "https://teluguvoice.vercel.app",
    title: "Telugu Voice - Premium Telugu Content Hub",
    description:
      "Discover the best Telugu content - audiobooks, spiritual content, and fascinating facts.",
    siteName: "Telugu Voice",
  },
  twitter: {
    card: "summary_large_image",
    title: "Telugu Voice",
    description: "Your premier destination for Telugu content",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import ContactButton from '@/components/ContactButton';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {children}
        <ContactButton />
      </body>
    </html>
  );
}
