"use client";

import React from "react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400 mt-2">Manage your account preferences and notification settings.</p>
      </div>

      <div className="glass-card p-8 rounded-2xl border border-glassBorder flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-6xl mb-4 opacity-50">⚙️</div>
        <h2 className="text-xl font-bold text-slate-300">Settings Module Coming Soon</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-md text-center">
          Options to manage API keys, configure webhooks, and customize your alert thresholds will be available here.
        </p>
      </div>
    </div>
  );
}
