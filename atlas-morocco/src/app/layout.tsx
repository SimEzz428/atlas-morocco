import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorker from "@/components/ServiceWorker";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { ToastProvider } from "@/components/ToastProvider";
import { PlanProvider } from "@/features/plan/PlanProvider";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter", 
  display: "swap",
  preload: true
});

const poppins = Poppins({ 
  weight: ["400", "500", "600", "700", "800"], 
  subsets: ["latin"], 
  variable: "--font-poppins", 
  display: "swap",
  preload: true
});

export const metadata: Metadata = {
  title: "Atlas Morocco - Plan Unforgettable Journeys",
  description: "Discover Morocco's hidden gems with our intelligent travel planner. Explore cities, plan itineraries, and experience authentic Moroccan culture.",
  keywords: [
    "Morocco travel",
    "travel planner",
    "Morocco cities",
    "itinerary planner",
    "Morocco tourism",
    "travel guide",
    "Morocco destinations"
  ],
  authors: [{ name: "Atlas Morocco Team" }],
  creator: "Atlas Morocco",
  publisher: "Atlas Morocco",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://atlas-morocco.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Atlas Morocco - Plan Unforgettable Journeys",
    description: "Discover Morocco's hidden gems with our intelligent travel planner.",
    url: 'https://atlas-morocco.com',
    siteName: 'Atlas Morocco',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Atlas Morocco - Plan Unforgettable Journeys',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Atlas Morocco - Plan Unforgettable Journeys",
    description: "Discover Morocco's hidden gems with our intelligent travel planner.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#C67C2B" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
              <body className="min-h-screen bg-white text-slate-900 antialiased">
                {children}
              </body>
    </html>
  );
}