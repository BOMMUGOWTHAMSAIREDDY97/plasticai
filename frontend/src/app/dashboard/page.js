"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, AlertTriangle, Box, Camera, MapPin, Loader2 } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function Dashboard() {
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

  const avgDensity = reports.length > 0 ? (reports.reduce((acc, curr) => acc + curr.plastic_percentage, 0) / reports.length) : 0;
  const criticalAreas = reports.filter(r => r.plastic_percentage > 75).length;
  const environmentalScore = 100 - Math.round(avgDensity);

  const stats = [
    { title: "Total Scans Performed", value: reports.length, icon: Camera, color: "text-blue-400", bg: "bg-blue-400/20" },
    { title: "Avg Garbage Density", value: `${avgDensity.toFixed(1)}%`, icon: Box, color: "text-primary", bg: "bg-primary/20" },
    { title: "Environmental Score", value: `${environmentalScore}/100`, icon: BarChart3, color: "text-purple-400", bg: "bg-purple-400/20" },
    { title: "Critical Risk Areas", value: criticalAreas, icon: AlertTriangle, color: "text-danger", bg: "bg-danger/20" },
  ];

  // Dynamic Chart Data based on actual scans
  const recentReports = [...reports].reverse().slice(-7);
  
  const chartData = {
    labels: recentReports.length > 0 ? recentReports.map(r => new Date(r.created_at).toLocaleDateString(undefined, { weekday: 'short' })) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        fill: true,
        label: 'Garbage Density %',
        data: recentReports.length > 0 ? recentReports.map(r => r.plastic_percentage) : [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard Overview</h1>
          <p className="text-textSecondary">Real-time environmental intelligence and analytics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-6 rounded-2xl glass-card flex items-center justify-between"
          >
            <div>
              <p className="text-textSecondary text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-2 p-6 rounded-2xl glass-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Detection Trends (7 Days)</h3>
            <button className="text-sm text-primary hover:text-primaryHover transition-colors">View Full Report</button>
          </div>
          <div className="h-72">
            <Line options={chartOptions} data={chartData} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="p-6 rounded-2xl glass-card overflow-hidden flex flex-col"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MapPin className="text-primary w-5 h-5" /> Recent Area Scans
          </h3>
          
          <div className="space-y-4 overflow-y-auto flex-1 pr-2" style={{ maxHeight: "350px" }}>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-10 text-textSecondary">
                <p>No area scans yet.</p>
                <p className="text-sm mt-1">Use the Live Camera to scan a village!</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="p-4 rounded-xl bg-surface/80 border border-glassBorder flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surfaceHighlight border border-glassBorder/50">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${report.image_url}`} 
                      alt="Area Scan" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-bold text-white mb-1 line-clamp-1">
                      {report.location_name || "Unknown Location"}
                    </p>
                    <p className="text-xs text-textSecondary mb-2">
                      {new Date(report.created_at).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        report.plastic_percentage > 75 ? "bg-red-500/20 text-red-400" :
                        report.plastic_percentage > 40 ? "bg-orange-500/20 text-orange-400" :
                        "bg-green-500/20 text-green-400"
                      }`}>
                        {report.plastic_percentage.toFixed(1)}% Garbage Density
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
