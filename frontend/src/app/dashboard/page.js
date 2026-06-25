"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, AlertTriangle, Box, Camera } from "lucide-react";
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
  const stats = [
    { title: "Total Plastic Detected", value: "1,248", icon: Box, color: "text-blue-400", bg: "bg-blue-400/20" },
    { title: "Active Detections", value: "3", icon: Camera, color: "text-primary", bg: "bg-primary/20" },
    { title: "Environmental Score", value: "85/100", icon: BarChart3, color: "text-purple-400", bg: "bg-purple-400/20" },
    { title: "Critical Risk Areas", value: "2", icon: AlertTriangle, color: "text-danger", bg: "bg-danger/20" },
  ];

  // Dummy Chart Data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        fill: true,
        label: 'Plastic Detections',
        data: [65, 59, 80, 81, 56, 55, 40],
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
          className="p-6 rounded-2xl glass-card"
        >
          <h3 className="text-xl font-semibold mb-6">AI Insights</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface/80 border border-glassBorder">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1 text-white">High concentration detected</p>
                  <p className="text-xs text-textSecondary">Large cluster of PET bottles detected in Sector 4 over the last 2 hours.</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-surface/80 border border-glassBorder">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1 text-white">Positive Trend</p>
                  <p className="text-xs text-textSecondary">Plastic density decreased by 15% compared to yesterday.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Need to define Camera since it was not imported in the scope, I will fix the import.
