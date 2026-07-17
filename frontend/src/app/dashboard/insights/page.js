"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, BrainCircuit, Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Info, Loader2, ArrowRight } from "lucide-react";

export default function AIInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const response = await fetch(`${baseUrl}/dashboard/insights`, { headers });
        if (response.ok) {
          const data = await response.json();
          setInsights(data);
        }
      } catch (err) {
        console.error("Failed to load AI insights:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, []);

  const getTypeStyles = (type) => {
    switch (type) {
      case "success":
        return { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
      case "warning":
        return { icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" };
      case "info":
      default:
        return { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1 flex items-center gap-2">
            <Sparkles className="text-primary w-8 h-8" /> AI Insights & Policy Support
          </h1>
          <p className="text-textSecondary">Automated strategic recommendations, waste deflection forecasts, and localized policy prompts.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight, idx) => {
            const styles = getTypeStyles(insight.type);
            const Icon = styles.icon;
            
            return (
              <motion.div
                key={insight.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`p-6 rounded-2xl border ${styles.bg} backdrop-blur shadow flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-5 h-5 ${styles.color}`} />
                      <h4 className="font-extrabold text-white text-base">{insight.title}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles.color} bg-white/5 uppercase tracking-wider`}>
                      {insight.metric}
                    </span>
                  </div>
                  <p className="text-textSecondary text-sm leading-relaxed">{insight.description}</p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-textSecondary font-medium">Confidence Score: <strong className="text-white">94%</strong></span>
                  <button className="text-primary hover:text-primaryHover font-bold flex items-center gap-1 transition-colors">
                    Draft Policy Directives <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
