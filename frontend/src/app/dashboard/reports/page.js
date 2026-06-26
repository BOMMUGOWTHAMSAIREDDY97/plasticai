"use client";

import React, { useState } from "react";

export default function ReportsPage() {
  const [downloading, setDownloading] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const triggerDownload = async (format) => {
    setErrorMsg("");
    setSuccessMsg("");
    setDownloading(format);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User credentials expired. Please login again.");
      }

      const response = await fetch("http://localhost:8000/api/v1/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          report_type: format
        })
      });

      if (!response.ok) {
        throw new Error(`Report generation failed. Ensure backend server is responsive.`);
      }

      // Convert response to blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      const fileExtensions = {
        PDF: "pdf",
        CSV: "csv",
        Excel: "xlsx"
      };
      
      a.download = `plasticvision_report_${new Date().toISOString().slice(0,10)}.${fileExtensions[format]}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccessMsg(`Successfully generated and downloaded ${format} document.`);
    } catch (err) {
      setErrorMsg(err.message || "Failed to download audit logs.");
    } finally {
      setDownloading("");
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Audit & Report Center</h1>
          <p className="text-xs text-slate-400">Generate executive Summaries, Excel spreadsheets, and CSV logs of detections.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs text-rose-400 font-semibold mb-6 text-center">
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 font-semibold mb-6 text-center">
          ✅ {successMsg}
        </div>
      )}

      {/* Reports Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* PDF Executive Report Card */}
        <div className="glass-card p-8 rounded-2xl flex flex-col justify-between border-t-4 border-red-500">
          <div>
            <div className="text-4xl mb-4">📕</div>
            <h3 className="text-lg font-bold mb-3">PDF Executive Summary</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              A high-level formatted document suitable for directors, board audits, and public transparency reports. Includes environmental scores, KPIs, and recommendations.
            </p>
          </div>
          <button
            onClick={() => triggerDownload("PDF")}
            disabled={downloading !== ""}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 font-semibold text-xs text-white transition-all disabled:opacity-50"
          >
            {downloading === "PDF" ? "Generating PDF..." : "Export PDF Summary"}
          </button>
        </div>

        {/* Excel Data Sheet Card */}
        <div className="glass-card p-8 rounded-2xl flex flex-col justify-between border-t-4 border-emerald-500">
          <div>
            <div className="text-4xl mb-4">📗</div>
            <h3 className="text-lg font-bold mb-3">Excel Telemetry Spreadsheet</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Detailed workbook containing time-series columns, material type logs, and coordinate data. Best for facility managers and system analysts.
            </p>
          </div>
          <button
            onClick={() => triggerDownload("Excel")}
            disabled={downloading !== ""}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white transition-all disabled:opacity-50"
          >
            {downloading === "Excel" ? "Generating Sheet..." : "Export Excel Data"}
          </button>
        </div>

        {/* CSV raw logs Card */}
        <div className="glass-card p-8 rounded-2xl flex flex-col justify-between border-t-4 border-blue-500">
          <div>
            <div className="text-4xl mb-4">📘</div>
            <h3 className="text-lg font-bold mb-3">Raw CSV Logs</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Minimal flat file log containing UTC timestamps, confidence levels, and coordinates. Best for custom import scripting and database feeds.
            </p>
          </div>
          <button
            onClick={() => triggerDownload("CSV")}
            disabled={downloading !== ""}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white transition-all disabled:opacity-50"
          >
            {downloading === "CSV" ? "Generating CSV..." : "Export CSV Logs"}
          </button>
        </div>

      </div>
    </div>
  );
}
