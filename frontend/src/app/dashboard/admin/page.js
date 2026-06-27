"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShieldAlert, Users, Database } from "lucide-react";

export default function AdminPage() {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("scans"); // 'scans' or 'users'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (activeTab === "scans") {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/scans/admin-reports`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setReports(res.data);
        } else {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/users`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsers(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch admin data", err);
        const backendError = err.response?.data?.detail || err.message;
        setError(`Failed to load: ${backendError}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/users/${userId}/role`, {
        role: newRole
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error("Failed to update role", err);
      alert("Failed to update user role");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-8 h-8 text-rose-500" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-slate-400 mt-2">Manage all system data and users.</p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-glassBorder pb-2">
        <button
          onClick={() => setActiveTab("scans")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "scans" ? "bg-primary text-white" : "hover:bg-surface text-slate-400"}`}
        >
          <Database className="w-4 h-4" /> Global Scans
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "users" ? "bg-primary text-white" : "hover:bg-surface text-slate-400"}`}
        >
          <Users className="w-4 h-4" /> User Management
        </button>
      </div>

      {error ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
          {error}
        </div>
      ) : activeTab === "scans" ? (
        <div className="glass-card rounded-2xl border border-glassBorder overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface/50 border-b border-glassBorder text-slate-400">
                <tr>
                  <th className="p-4 font-semibold">User ID</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Plastic %</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glassBorder">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400 animate-pulse">Loading global scan data...</td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">No scans recorded in the system yet.</td>
                  </tr>
                ) : (
                  reports.map(report => (
                    <tr key={report.id} className="hover:bg-surface/50 transition-colors">
                      <td className="p-4 font-mono">{report.user_id}</td>
                      <td className="p-4">{new Date(report.created_at).toLocaleDateString()}</td>
                      <td className="p-4 font-mono text-xs">{report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}</td>
                      <td className="p-4 font-bold text-red-400">{report.plastic_percentage.toFixed(1)}%</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                          {report.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${report.image_url}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Photo</a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-glassBorder overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface/50 border-b border-glassBorder text-slate-400">
                <tr>
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Joined</th>
                  <th className="p-4 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glassBorder">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400 animate-pulse">Loading users...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">No users found.</td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="hover:bg-surface/50 transition-colors">
                      <td className="p-4 font-mono text-xs text-slate-500">{user.id}</td>
                      <td className="p-4 font-medium">{user.full_name || "Unknown"}</td>
                      <td className="p-4 text-slate-400">{user.email}</td>
                      <td className="p-4 text-slate-400">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-surface border border-glassBorder rounded px-2 py-1 text-sm focus:outline-none focus:border-primary"
                        >
                          <option value="operator">Operator (Standard)</option>
                          <option value="government">Government Official</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
