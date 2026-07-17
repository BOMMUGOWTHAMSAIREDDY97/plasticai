"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Leaf, DollarSign, Award, Percent, Trash2, ShieldCheck, Loader2 } from "lucide-react";
import { Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RecyclingAnalytics() {
  const [data, setData] = useState({
    total_recycled_kg: 0.0,
    recycling_rate: 0.0,
    recovery_rate: 0.0,
    rejected_material_kg: 0.0,
    material_purity: 0.0,
    estimated_revenue_usd: 0.0,
    carbon_emissions_saved_kg: 0.0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecycling = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const response = await fetch(`${baseUrl}/analytics/recycling`, { headers });
        if (response.ok) {
          const resData = await response.json();
          setData(resData);
        }
      } catch (err) {
        console.error("Failed to load recycling statistics:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecycling();
  }, []);

  const kpis = [
    { title: "Total Recycled Plastic", value: `${data.total_recycled_kg.toLocaleString()} kg`, icon: RefreshCw, color: "text-emerald-400" },
    { title: "Recycling Rate", value: `${data.recycling_rate}%`, icon: Percent, color: "text-primary" },
    { title: "Recovery Rate", value: `${data.recovery_rate}%`, icon: Award, color: "text-teal-400" },
    { title: "Rejected Material", value: `${data.rejected_material_kg.toLocaleString()} kg`, icon: Trash2, color: "text-rose-400" },
    { title: "Estimated Revenue", value: `$${data.estimated_revenue_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: "text-amber-400" },
    { title: "Carbon Emissions Saved", value: `${data.carbon_emissions_saved_kg.toLocaleString()} kg CO2`, icon: Leaf, color: "text-sky-400" }
  ];

  const purityChartData = {
    labels: ['Clean Recycled', 'Impure / Residue'],
    datasets: [
      {
        data: [data.material_purity, 100 - data.material_purity],
        backgroundColor: ['#10b981', 'rgba(239, 68, 68, 0.2)'],
        borderColor: ['#10b981', 'rgba(239, 68, 68, 0.4)'],
        borderWidth: 1,
      },
    ],
  };

  const distributionChartData = {
    labels: ['PET (Polyethylene Terephthalate)', 'HDPE (High-Density Polyethylene)', 'LDPE', 'PP', 'Others'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1">Recycling Analytics</h1>
        <p className="text-textSecondary">Environmental offsets, recycling purity performance, and revenue projections.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpis.map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="p-6 rounded-2xl glass-card border border-glassBorder/30 bg-surface/30 flex items-center justify-between"
              >
                <div>
                  <p className="text-textSecondary text-xs font-semibold uppercase tracking-wider mb-2">{kpi.title}</p>
                  <h3 className="text-2xl font-bold text-white">{kpi.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-surfaceHighlight/50 flex items-center justify-center`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Purity pie chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl glass-card border border-glassBorder/30 bg-surface/30 flex flex-col items-center justify-center"
            >
              <h3 className="text-lg font-bold mb-4 self-start flex items-center gap-2">
                <ShieldCheck className="text-emerald-400 w-5 h-5" /> Average Material Purity Index
              </h3>
              <div className="w-64 h-64 relative">
                <Pie data={purityChartData} options={{ maintainAspectRatio: false }} />
              </div>
              <p className="text-sm text-textSecondary mt-4 text-center">
                A higher purity rate indicates excellent mechanical sorting. Clean polymers hold a premium price in secondary markets.
              </p>
            </motion.div>

            {/* Distribution donut chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl glass-card border border-glassBorder/30 bg-surface/30 flex flex-col items-center justify-center"
            >
              <h3 className="text-lg font-bold mb-4 self-start">Polymer Category Distribution</h3>
              <div className="w-64 h-64 relative">
                <Doughnut data={distributionChartData} options={{ maintainAspectRatio: false, cutOut: '70%' }} />
              </div>
              <p className="text-sm text-textSecondary mt-4 text-center">
                PET (bottles) represents the largest recycled category by weight, followed by HDPE (milk jugs/detergent boxes).
              </p>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
