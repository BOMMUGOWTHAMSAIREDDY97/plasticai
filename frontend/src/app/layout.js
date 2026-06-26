import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "PlasticVision AI | Enterprise Environmental Monitoring & Analytics",
  description: "Detect, classify, track and forecast plastic waste in real-time. Built for Municipalities, Recycling Plants, NGOs, and Research teams.",
  keywords: ["AI detection", "plastic waste", "object tracking", "environmental monitoring", "recycling", "real-time analytics"],
  authors: [{ name: "PlasticVision AI Team" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full dark`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
