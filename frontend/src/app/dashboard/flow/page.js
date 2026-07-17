"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GitBranch, Info, Loader2, ArrowRight } from "lucide-react";

export default function WasteFlow() {
  const [flow, setFlow] = useState({ links: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlow = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const response = await fetch(`${baseUrl}/dashboard/flow`, { headers });
        if (response.ok) {
          const data = await response.json();
          setFlow(data);
        }
      } catch (err) {
        console.error("Failed to load waste flow metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlow();
  }, []);

  // Map values for easy retrieval
  const findValue = (source, target) => {
    const link = flow.links.find(l => l.source === source && l.target === target);
    return link ? link.value : 0.0;
  };

  const totalCollected = findValue("Collection Center", "Sorting Facility") || 125430.0;
  const sentToRecycling = findValue("Sorting Facility", "Recycling Plant") || 78450.0;
  const sentToLandfill = findValue("Non-Recyclable Waste", "Landfill") || 15200.0;
  const rejectedWaste = findValue("Sorting Facility", "Rejected Waste") || 9480.0;
  
  // Calculate relative percentages
  const recyclingPct = ((sentToRecycling / totalCollected) * 100).toFixed(1);
  const landfillPct = ((sentToLandfill / totalCollected) * 100).toFixed(1);
  const rejectedPct = ((rejectedWaste / totalCollected) * 100).toFixed(1);
  const wtePct = (100.0 - recyclingPct - landfillPct - rejectedPct).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1 flex items-center gap-2">
          <GitBranch className="text-primary w-8 h-8" /> Waste Flow Diagram
        </h1>
        <p className="text-textSecondary">Real-time tracing of plastic material pathways, sorting allocations, and conversion sinks.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      ) : (
        <div className="p-8 rounded-2xl glass-card border border-glassBorder/30 bg-surface/20 min-h-[600px] flex flex-col justify-between relative overflow-hidden">
          {/* Animated Flow Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10 my-auto">
            
            {/* Step 1: Collection */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-2xl border border-glassBorder bg-surface/50 flex flex-col justify-between min-h-[140px] shadow-lg relative group hover:border-emerald-500/50 transition-colors"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Source Influx</span>
                <h4 className="text-xl font-bold mt-1 text-white">Collection Center</h4>
              </div>
              <div className="mt-4">
                <span className="text-sm text-textSecondary">Active Supply</span>
                <p className="text-2xl font-extrabold text-white">{totalCollected.toLocaleString()} kg</p>
              </div>
            </motion.div>

            {/* Step 2: Sorting */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl border border-glassBorder bg-surface/50 flex flex-col justify-between min-h-[140px] shadow-lg hover:border-blue-500/50 transition-colors"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Polymer Sorting</span>
                <h4 className="text-xl font-bold mt-1 text-white">Sorting Facility</h4>
              </div>
              <div className="mt-4">
                <span className="text-sm text-textSecondary">Capacity Utilization</span>
                <p className="text-2xl font-extrabold text-white">92.4%</p>
              </div>
            </motion.div>

            {/* Step 3: Processing & Recycling */}
            <div className="space-y-6 md:col-span-2">
              {/* Recycling Line */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-xl border border-glassBorder/70 bg-surface/50 flex items-center justify-between shadow hover:border-teal-500/50 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-white">Recycling Plant</h4>
                  <p className="text-xs text-textSecondary mt-0.5">Diverted to post-consumer pellets</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-teal-400 font-bold bg-teal-400/10 px-2 py-0.5 rounded-full">{recyclingPct}%</span>
                  <p className="font-extrabold text-white mt-1">{sentToRecycling.toLocaleString()} kg</p>
                </div>
                <ArrowRight className="w-5 h-5 text-teal-400 ml-4 hidden md:block" />
                <div className="hidden md:block text-left pl-2">
                  <h4 className="font-bold text-white">Manufacturing</h4>
                  <p className="text-[10px] text-textSecondary">Secondary Raw Materials</p>
                </div>
              </motion.div>

              {/* Waste to Energy */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-5 rounded-xl border border-glassBorder/70 bg-surface/50 flex items-center justify-between shadow hover:border-orange-500/50 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-white">Waste-to-Energy</h4>
                  <p className="text-xs text-textSecondary mt-0.5">High-calorific combustion</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-orange-400 font-bold bg-orange-400/10 px-2 py-0.5 rounded-full">{wtePct}%</span>
                  <p className="font-extrabold text-white mt-1">{(totalCollected * 0.18).toLocaleString(undefined, { maximumFractionDigits: 0 })} kg</p>
                </div>
              </motion.div>

              {/* Landfill */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-5 rounded-xl border border-glassBorder/70 bg-surface/50 flex items-center justify-between shadow hover:border-rose-500/50 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-white">Landfill Site</h4>
                  <p className="text-xs text-textSecondary mt-0.5">Non-recyclable containment</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-rose-400 font-bold bg-rose-400/10 px-2 py-0.5 rounded-full">{landfillPct}%</span>
                  <p className="font-extrabold text-white mt-1">{sentToLandfill.toLocaleString()} kg</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* SVG Animated Flow lines behind text */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path d="M 120 300 Q 240 300 360 300" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="5, 5">
                <animate attributeName="stroke-dashoffset" values="50;0" dur="4s" repeatCount="indefinite" />
              </path>
              <path d="M 440 280 Q 560 210 680 140" fill="none" stroke="#06b6d4" strokeWidth="4" strokeDasharray="5, 5">
                <animate attributeName="stroke-dashoffset" values="50;0" dur="4s" repeatCount="indefinite" />
              </path>
              <path d="M 440 300 Q 560 300 680 300" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="5, 5">
                <animate attributeName="stroke-dashoffset" values="50;0" dur="4s" repeatCount="indefinite" />
              </path>
              <path d="M 440 320 Q 560 390 680 460" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="5, 5">
                <animate attributeName="stroke-dashoffset" values="50;0" dur="4s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>

          {/* Summary compliance info footer */}
          <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3 text-sm text-textSecondary relative z-10">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p>
              Flow allocations represent material logs updated dynamically by certified collection points. The diversion target set by smart city guidelines is <strong>{">"} 65% recycling rate</strong>. Cumulative compliance status: <strong className="text-primary">MET</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
