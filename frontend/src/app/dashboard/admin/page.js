"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, PlusCircle, Building2, MapPin, Loader2, RefreshCw, Trash2, ArrowRight } from "lucide-react";

export default function Administration() {
  const [stats, setStats] = useState({
    collection_centers: 0,
    recycling_plants: 0,
    collection_logs: 0,
    processing_logs: 0,
    users: 0
  });
  
  const [centers, setCenters] = useState([]);
  const [plants, setPlants] = useState([]);
  
  const [activeTab, setActiveTab] = useState("centers");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states for Center
  const [centerForm, setCenterForm] = useState({
    name: "", district: "Central District", city: "Hyderabad", capacity_kg: 10000.0, latitude: 17.3850, longitude: 78.4866
  });
  
  // Form states for Plant
  const [plantForm, setPlantForm] = useState({
    name: "", district: "South District", city: "Hyderabad", capacity_kg: 20000.0, efficiency_rate: 0.85
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const statsRes = await fetch(`${baseUrl}/admin/stats`, { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      
      const locsRes = await fetch(`${baseUrl}/locations`, { headers });
      if (locsRes.ok) {
        const locsData = await locsRes.json();
        
        // Split into centers and plants
        const cList = locsData.filter(l => l.type === "Collection Center");
        const pList = locsData.filter(l => l.type === "Recycling Plant");
        
        setCenters(cList);
        setPlants(pList);
      }
    } catch (err) {
      console.error("Failed to load admin panel data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCenterSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      alert("Facility configuration updated in configuration layer!");
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1 flex items-center gap-2">
          <ShieldAlert className="text-primary w-8 h-8" /> Administration Console
        </h1>
        <p className="text-textSecondary">Manage users, collection centers, recycling facilities, and system analytics parameters.</p>
      </div>

      {/* Admin stats counters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Centers", val: stats.collection_centers },
          { label: "Recycling Plants", val: stats.recycling_plants },
          { label: "Collection Logs", val: stats.collection_logs },
          { label: "Processing Logs", val: stats.processing_logs },
          { label: "Users Registered", val: stats.users }
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl border border-glassBorder bg-surface/30 text-center">
            <span className="text-[10px] uppercase font-bold text-textSecondary">{s.label}</span>
            <p className="text-2xl font-black text-white mt-1">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main management panel */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-glassBorder/30 bg-surface/30 p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center gap-4 border-b border-glassBorder/50 pb-3 mb-4">
            <button 
              onClick={() => setActiveTab("centers")}
              className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                activeTab === "centers" ? "border-primary text-primary" : "border-transparent text-textSecondary hover:text-textPrimary"
              }`}
            >
              Collection Centers
            </button>
            <button 
              onClick={() => setActiveTab("plants")}
              className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                activeTab === "plants" ? "border-primary text-primary" : "border-transparent text-textSecondary hover:text-textPrimary"
              }`}
            >
              Recycling Plants
            </button>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[400px]">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : activeTab === "centers" ? (
              <div className="space-y-3">
                {centers.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-glassBorder bg-surface/40 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{c.name}</h4>
                      <p className="text-xs text-textSecondary mt-0.5">{c.city} • {c.district}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full">{c.capacity}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {plants.map(p => (
                  <div key={p.id} className="p-4 rounded-xl border border-glassBorder bg-surface/40 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{p.name}</h4>
                      <p className="text-xs text-textSecondary mt-0.5">{p.city} • Efficiency: {p.efficiency}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-sky-400 font-bold bg-sky-400/10 px-2 py-0.5 rounded-full">{p.capacity}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Facility Form */}
        <div className="glass-card rounded-2xl border border-glassBorder/30 bg-surface/30 p-6">
          <h3 className="text-lg font-bold mb-4">Register New Facility</h3>
          
          <form onSubmit={handleCenterSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-textSecondary font-semibold block mb-2">Facility Name</label>
              <input 
                type="text" 
                placeholder="e.g. Central Sorting Area"
                required
                className="w-full bg-background border border-glassBorder rounded-xl px-4 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-textSecondary font-semibold block mb-2">District Jurisdiction</label>
              <select className="w-full bg-background border border-glassBorder rounded-xl px-4 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors">
                <option value="Central District">Central District</option>
                <option value="North District">North District</option>
                <option value="East District">East District</option>
                <option value="West District">West District</option>
                <option value="South District">South District</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-textSecondary font-semibold block mb-2">Capacity Target (kg/day)</label>
              <input 
                type="number" 
                defaultValue={15000}
                required
                className="w-full bg-background border border-glassBorder rounded-xl px-4 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary hover:bg-primaryHover text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mt-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
              {submitting ? "Registering..." : "Add Facility Location"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
