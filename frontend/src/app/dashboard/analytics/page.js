"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Line, Doughnut } from "react-chartjs-2";
import { Loader2, TrendingDown, TrendingUp, Map, BarChart2 } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function AnalyticsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/scans/my-reports`, {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          cache: "no-store"
        });
        
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, []);

  // Process data for charts
  const sortedReports = [...reports].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  
  const dates = sortedReports.map(r => {
    const d = new Date(r.created_at);
    return `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  });
  
  const densities = sortedReports.map(r => r.plastic_percentage);

  // Group by location for Pie Chart
  const locationCounts = {};
  reports.forEach(r => {
    const loc = r.location_name || "Unknown";
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });

  const pieLabels = Object.keys(locationCounts);
  const pieData = Object.values(locationCounts);

  const lineChartData = {
    labels: dates,
    datasets: [
      {
        fill: true,
        label: 'Garbage Density %',
        data: densities,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8', maxTicksLimit: 10 } }
    }
  };

  const pieChartData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieData,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: 'rgba(15, 23, 42, 1)',
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#e2e8f0' } }
    }
  };

  const avgDensity = reports.length > 0 
    ? (reports.reduce((acc, curr) => acc + curr.plastic_percentage, 0) / reports.length).toFixed(1) 
    : 0;

  let mostPolluted = "N/A";
  let highestDensity = 0;
  if (reports.length > 0) {
    const highest = [...reports].sort((a, b) => b.plastic_percentage - a.plastic_percentage)[0];
    mostPolluted = highest.location_name || "Unknown";
    highestDensity = highest.plastic_percentage.toFixed(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Analytics</h1>
        <p className="text-sm text-slate-400 mt-2">Detailed charts and historical data based on your real-world scans.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl border border-glassBorder flex flex-col items-center justify-center">
          <div className="text-5xl mb-4 opacity-50">📷</div>
          <h2 className="text-xl font-bold text-slate-300">No Data Available</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-md text-center">
            Go to the Live Camera and take some scans to generate analytics!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl glass-card flex flex-col justify-center">
              <p className="text-slate-400 text-sm font-medium mb-1">Total Scans Performed</p>
              <h3 className="text-4xl font-bold text-white">{reports.length}</h3>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl glass-card flex flex-col justify-center">
              <p className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2"><Map className="w-4 h-4 text-blue-400" /> Most Polluted Area</p>
              <h3 className="text-xl font-bold text-white line-clamp-1" title={mostPolluted}>{mostPolluted}</h3>
              <p className="text-xs text-red-400 mt-1 font-mono">{highestDensity}% Peak Density</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl glass-card flex flex-col justify-center">
              <p className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-emerald-400" /> Average Density</p>
              <h3 className="text-4xl font-bold text-white flex items-end gap-2">
                {avgDensity}% 
                {avgDensity > 50 ? <TrendingUp className="w-6 h-6 text-red-500 mb-1" /> : <TrendingDown className="w-6 h-6 text-emerald-500 mb-1" />}
              </h3>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl glass-card h-[400px] flex flex-col">
              <h3 className="text-lg font-bold mb-4">Historical Garbage Density</h3>
              <div className="flex-1 min-h-0">
                <Line options={lineChartOptions} data={lineChartData} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-2xl glass-card h-[400px] flex flex-col">
              <h3 className="text-lg font-bold mb-4">Scan Distribution by Location</h3>
              <div className="flex-1 min-h-0 flex items-center justify-center">
                <Doughnut options={pieChartOptions} data={pieChartData} />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
