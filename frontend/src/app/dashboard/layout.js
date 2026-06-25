"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-textPrimary flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen relative">
        {/* Background glow for dashboard */}
        <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        
        <Navbar />
        <main className="flex-1 p-8 overflow-y-auto z-10 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
