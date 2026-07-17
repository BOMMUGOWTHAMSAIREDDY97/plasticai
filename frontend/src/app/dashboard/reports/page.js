"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, FileSpreadsheet, FileArchive, Plus, Loader2, Sparkles, AlertCircle } from "lucide-react";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Executive");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${baseUrl}/reports/list`, { headers });
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (err) {
      console.error("Failed to load reports list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const triggerExport = async (format) => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const url = `${baseUrl}/reports/download/${format}`;
      
      // Perform direct download using standard window.open or fetch depending on auth headers
      // Since it's a file download, we can fetch it with header and prompt save, or open with token query param
      const response = await fetch(url, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        
        const ext = format === "excel" ? "xlsx" : format;
        link.setAttribute('download', `environmental_audit_report.${ext}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        alert("Failed to export report in selected format.");
      }
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleCompile = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setGenerating(true);
      const token = localStorage.getItem("token");
      const headers = token ? { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      } : { 
        "Content-Type": "application/json" 
      };
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await fetch(`${baseUrl}/reports/generate?title=${encodeURIComponent(newTitle)}&report_type=${newType}`, {
        method: "POST",
        headers
      });

      if (response.ok) {
        setNewTitle("");
        fetchReports();
      }
    } catch (err) {
      console.error("Error generating report log:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1 flex items-center gap-2">
          <FileText className="text-primary w-8 h-8" /> Compliance Reports & Exports
        </h1>
        <p className="text-textSecondary">Generate regional waste statistics summaries and export environmental logs in standardized formats.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Export triggers panel */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl glass-card border border-glassBorder/30 bg-surface/30 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Instant Audit Compilation
              </h3>
              <p className="text-sm text-textSecondary mb-6">
                Download the compiled regional environmental audit report containing collection rates, diversion rates, carbon offsets, and strategic action plans.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* PDF */}
              <button 
                onClick={() => triggerExport("pdf")}
                className="p-4 rounded-xl border border-glassBorder hover:border-primary bg-surface/50 hover:bg-surfaceHover flex flex-col items-center justify-center gap-3 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <span className="font-bold text-white text-sm">Export PDF</span>
                  <p className="text-[10px] text-textSecondary mt-0.5">Executive Template</p>
                </div>
              </button>

              {/* Excel */}
              <button 
                onClick={() => triggerExport("excel")}
                className="p-4 rounded-xl border border-glassBorder hover:border-primary bg-surface/50 hover:bg-surfaceHover flex flex-col items-center justify-center gap-3 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="font-bold text-white text-sm">Export Excel</span>
                  <p className="text-[10px] text-textSecondary mt-0.5">Spreadsheet Data</p>
                </div>
              </button>

              {/* CSV */}
              <button 
                onClick={() => triggerExport("csv")}
                className="p-4 rounded-xl border border-glassBorder hover:border-primary bg-surface/50 hover:bg-surfaceHover flex flex-col items-center justify-center gap-3 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileArchive className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <span className="font-bold text-white text-sm">Export CSV</span>
                  <p className="text-[10px] text-textSecondary mt-0.5">Plain Comma Separated</p>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Compilation log history */}
          <div className="p-6 rounded-2xl glass-card border border-glassBorder/30 bg-surface/30">
            <h3 className="text-lg font-bold mb-4">Report Archive & Generation Logs</h3>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-10 text-textSecondary border border-dashed border-glassBorder rounded-xl">
                <p>No compiled reports in archive.</p>
                <p className="text-xs mt-1">Use the right panel to compile a new record.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-4 rounded-xl border border-glassBorder bg-surface/50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded bg-surfaceHighlight flex items-center justify-center">
                        <FileText className="w-5 h-5 text-textSecondary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{rep.title}</h4>
                        <p className="text-xs text-textSecondary mt-0.5">
                          {rep.report_type} • Compiled: {new Date(rep.generated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => triggerExport("pdf")}
                      className="px-3 py-1.5 bg-surfaceHighlight hover:bg-surfaceHover border border-glassBorder rounded-lg text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compile New Report form */}
        <div className="glass-card rounded-2xl border border-glassBorder/30 bg-surface/30 p-6 h-fit">
          <h3 className="text-lg font-bold mb-4">Compile New Report</h3>
          <form onSubmit={handleCompile} className="space-y-4">
            <div>
              <label className="text-xs text-textSecondary font-semibold block mb-2">Report Document Title</label>
              <input 
                type="text" 
                placeholder="e.g. Q3 Environmental Audit"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full bg-background border border-glassBorder rounded-xl px-4 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-textSecondary font-semibold block mb-2">Audit Report Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-background border border-glassBorder rounded-xl px-4 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors"
              >
                <option value="Executive">Executive Summary</option>
                <option value="Monthly">Monthly Summary</option>
                <option value="Annual">Annual Sustainability Report</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full py-3 bg-primary hover:bg-primaryHover text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mt-2"
            >
              {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              {generating ? "Compiling..." : "Generate Compliance Log"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
