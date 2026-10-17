import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorker from "@/components/ServiceWorker";
import { Providers } from "@/components/Providers";
import { siteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const description =
  "Discover Morocco's hidden gems with our travel planner. Explore cities, plan itineraries, and experience authentic Moroccan culture.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Atlas Morocco - Plan Unforgettable Journeys",
    template: "%s | Atlas Morocco",
  },
  description,
  keywords: ["Morocco travel", "travel planner", "Morocco cities", "itinerary planner", "Morocco tourism", "travel guide"],
  applicationName: "Atlas Morocco",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Atlas Morocco - Plan Unforgettable Journeys",
    description,
    siteName: "Atlas Morocco",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas Morocco - Plan Unforgettable Journeys",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#C67C2B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ServiceWorker />
        </Providers>
      </body>
    </html>
  );
}
