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
      <body className="min-h-full flex flex-col font-sans relative overflow-x-hidden text-slate-100 bg-[#040814]" suppressHydrationWarning>
        {/* Beautiful Animated Background */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-700/30 blur-[140px] animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-[30%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[160px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
          <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-600/15 blur-[150px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '3s' }}></div>
          {/* Subtle noise overlay */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 mix-blend-overlay opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        </div>
        {children}
      </body>
    </html>
  );
}
