import type { Metadata } from "next";

import "./globals.css";
import { Navigation } from "@/components/Navigations";
import { Footer } from "@/components/Footer";
import localFont from "next/font/local";

const helveticaNeue = localFont({
  src: [
    {
      path: "../public/fonts/helvetica-neue/HelveticaNeueThin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica-neue/HelveticaNeueUltraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica-neue/HelveticaNeueLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica-neue/HelveticaNeueRoman.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica-neue/HelveticaNeueMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica-neue/HelveticaNeueBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica-neue/HelveticaNeueHeavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica-neue/HelveticaNeueBlack.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica-neue/HelveticaNeueItalic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-helvetica-neue",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hybrid Marketplace & Directory",
  description:
    "Explore our hybrid marketplace with directory features, built on Next.js 15 for a seamless browsing experience.",
  openGraph: {
    title: "Hybrid Marketplace & Directory",
    description:
      "Explore our hybrid marketplace with directory features, built on Next.js 15 for a seamless browsing experience.",
    url: "https://next-marketplace-eta.vercel.app/",
    siteName: "Next Marketplace",
    images: [
      {
        url: "/berlin-logo.png", // path to your image
        width: 1200,
        height: 630,
        alt: "Hybrid Marketplace & Directory",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hybrid Marketplace & Directory | Next.js App",
    description:
      "Explore our hybrid marketplace with directory features, built on Next.js 15 for a seamless browsing experience.",
    images: ["/berlin-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${helveticaNeue.variable}`}>
      <body>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
