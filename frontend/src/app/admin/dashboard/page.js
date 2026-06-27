"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Shield, LogOut, Loader2, ArrowLeft, MapPin, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || role !== "admin") {
        router.push("/admin/login");
        return;
      }

      try {
        const timestamp = new Date().getTime();
        const [usersRes, scansRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/users?t=${timestamp}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/scans/admin-reports?t=${timestamp}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setUsers(usersRes.data);
        setScans(scansRes.data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load user data. Ensure you have admin privileges.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately on mount
    fetchData();

    // Set up 1-second polling
    intervalId = setInterval(fetchData, 1000);

    // Cleanup interval on unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      const { signOut } = await import("firebase/auth");
      const { auth } = await import("../../../firebaseConfig");
      await signOut(auth);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-danger animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary">
      {/* Navbar */}
      <nav className="border-b border-glassBorder bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-danger" />
              <span className="text-xl font-bold">Admin Dashboard</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-white/5 border border-glassBorder transition-colors text-sm font-medium text-danger"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Stats Summary */}
        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-xl border border-glassBorder bg-surface">
              <p className="text-textSecondary text-sm font-medium">Total Registered Users</p>
              <p className="text-3xl font-bold mt-2">{users.length}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-xl border border-glassBorder bg-surface">
              <p className="text-textSecondary text-sm font-medium">Total Platform Scans</p>
              <p className="text-3xl font-bold mt-2 text-primary">{scans.length}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-xl border border-glassBorder bg-surface">
              <p className="text-textSecondary text-sm font-medium">Active Accounts</p>
              <p className="text-3xl font-bold mt-2 text-green-400">{users.filter(u => u.is_active).length}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-xl border border-glassBorder bg-surface">
              <p className="text-textSecondary text-sm font-medium">Global Avg Density</p>
              <p className="text-3xl font-bold mt-2 text-orange-400">
                {scans.length > 0 ? (scans.reduce((acc, curr) => acc + curr.plastic_percentage, 0) / scans.length).toFixed(1) : 0}%
              </p>
            </motion.div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-textSecondary text-sm">View and manage all registered users.</p>
          </div>
          <div className="flex items-center gap-2 bg-surface border border-glassBorder px-4 py-2 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-semibold">{users.length} Users</span>
          </div>
        </div>

        {error ? (
          <div className="p-4 rounded-lg bg-danger/20 border border-danger/50 text-danger mb-6">
            {error}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-glassBorder bg-white/5">
                    <th className="px-6 py-4 text-sm font-semibold text-textSecondary">User Info</th>
                    <th className="px-6 py-4 text-sm font-semibold text-textSecondary">Role</th>
                    <th className="px-6 py-4 text-sm font-semibold text-textSecondary">Top Location</th>
                    <th className="px-6 py-4 text-sm font-semibold text-textSecondary">Joined Date</th>
                    <th className="px-6 py-4 text-sm font-semibold text-textSecondary">Impact Score</th>
                    <th className="px-6 py-4 text-sm font-semibold text-textSecondary">Scans Count</th>
                    <th className="px-6 py-4 text-sm font-semibold text-textSecondary">Avg Density</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glassBorder">
                  {users.map((user) => {
                    const userScansList = scans.filter(s => s.user_id === user.id);
                    const userScans = userScansList.length;
                    const avgDensity = userScans > 0 ? (userScansList.reduce((acc, curr) => acc + curr.plastic_percentage, 0) / userScans) : 0;
                    
                    // Calculate most frequent location
                    const locationCounts = {};
                    let topLocation = "Unknown";
                    let topLat = null;
                    let topLng = null;
                    let maxCount = 0;
                    
                    userScansList.forEach(s => {
                      if (s.location_name || (s.latitude && s.longitude)) {
                        const locKey = s.location_name || `${s.latitude.toFixed(4)}, ${s.longitude.toFixed(4)}`;
                        locationCounts[locKey] = (locationCounts[locKey] || 0) + 1;
                        if (locationCounts[locKey] > maxCount) {
                          maxCount = locationCounts[locKey];
                          topLocation = locKey;
                          topLat = s.latitude;
                          topLng = s.longitude;
                        }
                      }
                    });
                    
                    return (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                              {user.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{user.full_name}</p>
                              <p className="text-xs text-textSecondary">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            user.role === 'admin' 
                              ? 'bg-danger/20 border-danger/50 text-danger' 
                              : user.role === 'operator'
                              ? 'bg-primary/20 border-primary/50 text-primary'
                              : 'bg-green-500/20 border-green-500/50 text-green-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-1 text-sm text-textSecondary max-w-[150px]">
                             <div className="flex items-center gap-1 truncate">
                               <MapPin className="w-3 h-3 min-w-3" />
                               <span className="truncate" title={topLocation}>{topLocation}</span>
                             </div>
                             {topLat && topLng && (
                               <a 
                                 href={`https://www.google.com/maps/search/?api=1&query=${topLat},${topLng}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-xs text-blue-400 hover:text-blue-300 transition-colors truncate"
                               >
                                 {topLat.toFixed(5)}, {topLng.toFixed(5)}
                               </a>
                             )}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-textSecondary">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-primary">
                            {userScans * 10} pts
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold bg-surface border border-glassBorder px-3 py-1 rounded-lg text-textSecondary">
                            {userScans}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                           {userScans > 0 ? (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              avgDensity > 75 
                                ? 'bg-danger/20 border-danger/50 text-danger' 
                                : avgDensity > 40
                                ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                                : 'bg-green-500/20 border-green-500/50 text-green-400'
                            }`}>
                              {avgDensity.toFixed(1)}%
                            </span>
                           ) : (
                             <span className="text-sm text-textSecondary">N/A</span>
                           )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="p-8 text-center text-textSecondary">
                  No users found.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Scans Management Section */}
        <div className="flex items-center justify-between mt-12 mb-8">
          <div>
            <h2 className="text-2xl font-bold">All Scans</h2>
            <p className="text-textSecondary text-sm">Review environmental scans submitted by users.</p>
            <a 
              href="https://drive.google.com/drive/folders/1WLK2WT3E4Y-G855KOKjafsmB-gQi3ti2?usp=drive_link" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
            >
              <Camera className="w-4 h-4" /> Open Cloud Storage Drive
            </a>
          </div>
          <div className="flex items-center gap-2 bg-surface border border-glassBorder px-4 py-2 rounded-lg">
            <Camera className="w-5 h-5 text-green-400" />
            <span className="font-semibold">{scans.length} Scans</span>
          </div>
        </div>

        {!error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-glassBorder bg-white/5">
                    <th className="px-6 py-4 text-sm font-semibold text-textSecondary">Image</th>
                    <th className="px-6 py-4 text-sm font-semibold text-textSecondary">User ID</th>
                    <th className="px-6 py-4 text-sm font-semibold text-textSecondary">Location</th>
                    <th className="px-6 py-4 text-sm font-semibold text-textSecondary">Density</th>
                    <th className="px-6 py-4 text-sm font-semibold text-textSecondary">Map</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glassBorder">
                  {scans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${scan.image_url}`} 
                          alt="Scan" 
                          className="w-12 h-12 rounded object-cover border border-glassBorder"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-textSecondary">#{scan.user_id}</td>
                      <td className="px-6 py-4 font-medium">{scan.location_name || "Unknown"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          scan.plastic_percentage > 75 
                            ? 'bg-danger/20 border-danger/50 text-danger' 
                            : scan.plastic_percentage > 40
                            ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                            : 'bg-green-500/20 border-green-500/50 text-green-400'
                        }`}>
                          {scan.plastic_percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {(scan.latitude && scan.longitude) ? (
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${scan.latitude},${scan.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <MapPin className="w-4 h-4" /> View Map
                          </a>
                        ) : (
                          <span className="text-sm text-textSecondary">No GPS</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {scans.length === 0 && (
                <div className="p-8 text-center text-textSecondary">
                  No scans found.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
