"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Key, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Settings</h1>
        <p className="text-textSecondary">Manage your account preferences and system configurations.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Profile Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card p-6 rounded-2xl border border-glassBorder"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-glassBorder/50">
            <div className="p-2 bg-primary/20 rounded-lg">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Account Profile</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-textSecondary">Full Name</label>
              <input type="text" defaultValue="Admin User" className="w-full bg-surface/50 border border-glassBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-textSecondary">Email Address</label>
              <input type="email" defaultValue="admin@plasticvision.ai" className="w-full bg-surface/50 border border-glassBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>
        </motion.div>

        {/* Notifications & Preferences */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card p-6 rounded-2xl border border-glassBorder"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-glassBorder/50">
            <div className="p-2 bg-warning/20 rounded-lg">
              <Bell className="w-5 h-5 text-warning" />
            </div>
            <h2 className="text-xl font-semibold">Notifications & Alerts</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white mb-1">Critical Pollution Alerts</p>
                <p className="text-sm text-textSecondary">Receive immediate emails when an area exceeds 75% garbage density.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white mb-1">Weekly Summary Reports</p>
                <p className="text-sm text-textSecondary">Get a weekly breakdown of detection trends and analytics.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="pt-4 border-t border-glassBorder/50">
              <label className="text-sm font-medium text-textSecondary mb-2 block">Local Authorities Contact</label>
              <div className="flex gap-4">
                <input type="email" placeholder="e.g. sanitation@cityhall.gov" defaultValue="environment@localgov.in" className="flex-1 bg-surface/50 border border-glassBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                <button className="px-6 py-3 bg-danger/20 text-danger hover:bg-danger/30 rounded-xl font-medium transition-colors whitespace-nowrap">
                  Mail Latest Report
                </button>
              </div>
              <p className="text-xs text-textSecondary mt-2">Configure the official government or NGO email address to receive critical pollution alerts.</p>
            </div>
          </div>
        </motion.div>

        {/* API Integrations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card p-6 rounded-2xl border border-glassBorder"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-glassBorder/50">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Key className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold">API Integrations</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-textSecondary flex justify-between">
                <span>Personal Access Token</span>
                <button className="text-primary hover:text-primaryHover text-xs transition-colors">Regenerate</button>
              </label>
              <div className="relative">
                <input type="password" readOnly defaultValue="sk_test_1234567890abcdef1234567890abcdef" className="w-full bg-surface/50 border border-glassBorder rounded-xl px-4 py-3 text-white opacity-70 cursor-not-allowed" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-textSecondary">Webhook URL</label>
              <input type="url" placeholder="https://your-dashboard.com/webhook" className="w-full bg-surface/50 border border-glassBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
              <p className="text-xs text-textSecondary mt-1">We will send real-time POST requests here when new scans are analyzed.</p>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex justify-end pt-4"
        >
          <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${saved ? 'bg-[#10b981] text-white' : 'bg-primary hover:bg-primaryHover text-white'}`}
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" /> Saved Successfully
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> Save Changes
              </>
            )}
          </button>
        </motion.div>

      </div>
    </div>
  );
}
