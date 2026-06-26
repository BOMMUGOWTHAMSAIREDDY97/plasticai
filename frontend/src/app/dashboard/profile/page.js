"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Bell, Save, Check } from "lucide-react";

export default function ProfilePage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://plasticai.onrender.com/scans/my-reports", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store"
        });
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();

    // Fetch user details
    import("../../../firebaseConfig").then(({ auth }) => {
      import("firebase/auth").then(({ onAuthStateChanged }) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserEmail(user.email || "");
            setUserName(user.displayName || "Customer User");
          }
        });
      });
    }).catch(err => console.error("Firebase load error:", err));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Customer Profile</h1>
        <p className="text-sm text-slate-400 mt-2">View your personal scan history and environmental impact.</p>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-glassBorder">
        <h2 className="text-xl font-bold mb-4">My Scan History</h2>
        
        {loading ? (
          <div className="animate-pulse text-slate-400">Loading your scans...</div>
        ) : reports.length === 0 ? (
          <div className="text-slate-500 text-sm py-12 text-center">You haven't made any scans yet. Go to Live Camera to start!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map(report => (
              <div key={report.id} className="bg-surface/50 rounded-xl overflow-hidden border border-glassBorder">
                <img src={`https://plasticai.onrender.com${report.image_url}`} alt="Scan" className="w-full h-48 object-cover" />
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400">Date</span>
                    <span className="text-sm">{new Date(report.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400">Plastic Waste</span>
                    <span className="text-sm font-bold text-red-400">{report.plastic_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400">Location</span>
                    <span className="text-xs font-mono">{report.location_name || `${report.latitude?.toFixed(4)}, ${report.longitude?.toFixed(4)}`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 pt-6 border-t border-glassBorder/30">
        <h2 className="text-2xl font-bold">Preferences</h2>
        
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
              <input type="text" value={userName} onChange={e => setUserName(e.target.value)} className="w-full bg-surface/50 border border-glassBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-textSecondary">Email Address</label>
              <input type="email" value={userEmail} readOnly className="w-full bg-surface/50 border border-glassBorder rounded-xl px-4 py-3 text-white opacity-70 cursor-not-allowed" />
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
                <p className="font-medium text-white mb-1">Auto-Report to Authorities</p>
                <p className="text-sm text-textSecondary">Automatically email local municipal authorities when severe pollution issues are detected.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-danger"></div>
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
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex justify-end pt-4 pb-12"
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
