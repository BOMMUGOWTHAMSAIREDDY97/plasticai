"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Bell, ShieldCheck, SunMoon, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const [refreshInterval, setRefreshInterval] = useState("30");
  const [purityThreshold, setPurityThreshold] = useState("90");
  const [recyclingGoal, setRecyclingGoal] = useState("65");
  
  const [notifications, setNotifications] = useState({
    purityDrops: true,
    capacityExceeded: true,
    weeklyDigest: false
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert("Dashboard settings persisted locally!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1 flex items-center gap-2">
          <Settings className="text-primary w-8 h-8" /> Dashboard Settings
        </h1>
        <p className="text-textSecondary">Configure automatic refresh rates, system thresholds, notification triggers, and dark/light modes.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main preferences card */}
        <div className="lg:col-span-2 space-y-6">
          {/* General settings */}
          <div className="p-6 rounded-2xl glass-card border border-glassBorder/30 bg-surface/30 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-glassBorder/50 pb-3">
              <SunMoon className="w-5 h-5 text-primary" /> General Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-textSecondary font-semibold block mb-2">Telemetry Auto-Refresh Interval</label>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(e.target.value)}
                  className="w-full bg-background border border-glassBorder rounded-xl px-4 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="10">Every 10 seconds</option>
                  <option value="30">Every 30 seconds</option>
                  <option value="60">Every 1 minute</option>
                  <option value="300">Every 5 minutes</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-textSecondary font-semibold block mb-2">Display Mode Theme</label>
                <select className="w-full bg-background border border-glassBorder rounded-xl px-4 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors">
                  <option value="dark">Dark Mode (Optimized)</option>
                  <option value="light">Light Mode</option>
                </select>
              </div>
            </div>
          </div>

          {/* Operational thresholds */}
          <div className="p-6 rounded-2xl glass-card border border-glassBorder/30 bg-surface/30 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-glassBorder/50 pb-3">
              <ShieldCheck className="w-5 h-5 text-primary" /> Compliance & Warning Thresholds
            </h3>

            <div className="space-y-6">
              {/* Recycling target */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-textSecondary font-semibold">Target Diversion Recycling Rate ({recyclingGoal}%)</label>
                  <span className="text-xs font-bold text-primary">Regional Standard: 60%</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="90" 
                  value={recyclingGoal}
                  onChange={(e) => setRecyclingGoal(e.target.value)}
                  className="w-full h-1.5 bg-background rounded-lg appearance-none cursor-pointer accent-primary" 
                />
              </div>

              {/* Purity Target */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-textSecondary font-semibold">Minimum Material Purity Threshold ({purityThreshold}%)</label>
                  <span className="text-xs font-bold text-orange-400">Alert Limit</span>
                </div>
                <input 
                  type="range" 
                  min="75" 
                  max="98" 
                  value={purityThreshold}
                  onChange={(e) => setPurityThreshold(e.target.value)}
                  className="w-full h-1.5 bg-background rounded-lg appearance-none cursor-pointer accent-primary" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications config side panel */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl border border-glassBorder/30 bg-surface/30 p-6 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-glassBorder/50 pb-3">
              <Bell className="w-5 h-5 text-primary" /> Alert Triggers
            </h3>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={notifications.purityDrops}
                  onChange={(e) => setNotifications({...notifications, purityDrops: e.target.checked})}
                  className="mt-1 rounded bg-background border-glassBorder text-primary focus:ring-primary focus:ring-opacity-25"
                />
                <div>
                  <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">Purity Level Alerts</span>
                  <p className="text-[11px] text-textSecondary">Trigger alerts if sorting purity drops below established targets.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={notifications.capacityExceeded}
                  onChange={(e) => setNotifications({...notifications, capacityExceeded: e.target.checked})}
                  className="mt-1 rounded bg-background border-glassBorder text-primary focus:ring-primary focus:ring-opacity-25"
                />
                <div>
                  <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">Capacity Warnings</span>
                  <p className="text-[11px] text-textSecondary">Trigger warnings when collection depots reach 90% load.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={notifications.weeklyDigest}
                  onChange={(e) => setNotifications({...notifications, weeklyDigest: e.target.checked})}
                  className="mt-1 rounded bg-background border-glassBorder text-primary focus:ring-primary focus:ring-opacity-25"
                />
                <div>
                  <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">Weekly Executive Digest</span>
                  <p className="text-[11px] text-textSecondary">Receive weekly automated summary audits in your inbox.</p>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primaryHover text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-5 h-5" /> Save Configuration
          </button>
        </div>

      </form>
    </div>
  );
}
