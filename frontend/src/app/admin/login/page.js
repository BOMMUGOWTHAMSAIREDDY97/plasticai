"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { signInWithEmailAndPassword, signOut } = await import("firebase/auth");
      const { auth } = await import("../../../firebaseConfig");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const token = await userCredential.user.getIdToken();
      
      // Sync with backend to get the user's role
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/sync-user`, {
        email,
        full_name: email.split("@")[0],
        role: "operator", // Will not overwrite existing role
        password: "FIREBASE_MANAGED"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.role !== "admin") {
        await signOut(auth);
        setError("Access denied. You do not have admin privileges.");
        return;
      }
      
      localStorage.setItem("token", token);
      localStorage.setItem("role", res.data.role);

      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-textPrimary px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-danger/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 rounded-2xl glass-card relative z-10 border-t-4 border-t-danger"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-8 h-8 text-danger" />
            <span className="text-2xl font-bold tracking-tight">Admin Portal</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Secure Login</h2>
          <p className="text-textSecondary text-sm">Sign in to access the admin dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-danger/20 border border-danger/50 text-danger text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-glassBorder rounded-lg focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger transition-colors"
                placeholder="admin@organization.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-textSecondary">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-glassBorder rounded-lg focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 rounded-lg bg-danger hover:bg-dangerHover text-white font-semibold flex items-center justify-center gap-2 transition-all glow-btn-red"
          >
            Authenticate <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm text-textSecondary hover:text-white transition-colors">
            Return to User Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
