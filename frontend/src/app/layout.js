import "./globals.css";

export const metadata = {
  title: "PlasticVision AI | Enterprise Environmental Monitoring & Analytics",
  description: "Detect, classify, track and forecast plastic waste in real-time. Built for Municipalities, Recycling Plants, NGOs, and Research teams.",
  keywords: ["AI detection", "plastic waste", "object tracking", "environmental monitoring", "recycling", "real-time analytics"],
  authors: [{ name: "PlasticVision AI Team" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
