"use client";

import React from "react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Analytics</h1>
        <p className="text-sm text-slate-400 mt-2">Detailed charts and historical data will be available here.</p>
      </div>

      <div className="glass-card p-8 rounded-2xl border border-glassBorder flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-6xl mb-4 opacity-50">📊</div>
        <h2 className="text-xl font-bold text-slate-300">Analytics Module Coming Soon</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-md text-center">
          We are integrating advanced predictive models to help you forecast plastic accumulation zones.
        </p>
      </div>
    </div>
  );
}
