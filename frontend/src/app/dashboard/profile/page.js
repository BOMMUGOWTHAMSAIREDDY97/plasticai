"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://plasticai.onrender.com/scans/my-reports", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(res.data);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
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
    </div>
  );
}
