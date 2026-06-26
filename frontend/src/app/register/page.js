"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Mail, Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 1. Create user in Firebase
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("../../firebaseConfig");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Get Firebase token
      const token = await userCredential.user.getIdToken();
      
      // 3. Sync user with local Postgres/SQLite backend
      await axios.post("http://localhost:8000/auth/sync-user", {
        email,
        full_name: name,
        role: "operator",
        password: "FIREBASE_MANAGED"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // 4. Save role to localStorage
      localStorage.setItem("role", "operator");

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
      const { auth } = await import("../../firebaseConfig");
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      
      const userEmail = userCredential.user.email;
      const userName = userCredential.user.displayName || userEmail.split("@")[0];
      
      // Sync with backend
      const res = await axios.post("https://plasticai.onrender.com/auth/sync-user", {
        email: userEmail,
        full_name: userName,
        role: "operator", 
        password: "FIREBASE_MANAGED_GOOGLE"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem("role", res.data.role);

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-textPrimary px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 rounded-2xl glass-card relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight">PlasticVision</span>
          </Link>
          <h2 className="text-2xl font-semibold mb-2">Create Account</h2>
          <p className="text-textSecondary text-sm">Join the platform to monitor plastic waste</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-danger/20 border border-danger/50 text-danger text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-glassBorder rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-glassBorder rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="name@organization.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-glassBorder rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 rounded-lg bg-primary hover:bg-primaryHover text-white font-semibold flex items-center justify-center gap-2 transition-all glow-btn-purple"
          >
            Create Account <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-glassBorder" />
          <span className="p-2 text-xs text-textSecondary uppercase">Or</span>
          <hr className="w-full border-glassBorder" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-6 py-3 rounded-lg bg-surface border border-glassBorder hover:bg-white/5 font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>

        <p className="mt-8 text-center text-sm text-textSecondary">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:text-primaryHover transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
