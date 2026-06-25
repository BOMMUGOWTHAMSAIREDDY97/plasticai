"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Get user info from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    const htmlEl = document.documentElement;
    if (newTheme === "light") {
      htmlEl.classList.remove("dark");
      htmlEl.classList.add("light");
    } else {
      htmlEl.classList.remove("light");
      htmlEl.classList.add("dark");
    }
  };

  const navLinks = [
    { name: "📊 Dashboard", path: "/dashboard" },
    { name: "📷 Live Stream", path: "/camera" },
    { name: "📋 Audit Reports", path: "/reports" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900 transition-colors duration-300">
      
      {/* Top Header Navigation */}
      <header className="glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">
            PV
          </Link>
          <div>
            <Link href="/" className="font-bold text-base tracking-wider hover:text-purple-400 transition-colors">PLASTICVISION AI</Link>
            <span className="text-[9px] uppercase font-bold text-purple-400 tracking-widest block">CONTROL SYSTEM</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-white/5 light:bg-slate-200/50 p-1.5 rounded-xl border border-white/5 light:border-slate-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 light:text-slate-600 light:hover:text-slate-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User profile dropdown & Theme switcher */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors light:border-slate-300 light:hover:bg-slate-100"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          
          {user && (
            <div className="flex items-center gap-3 border-l border-white/10 light:border-slate-300 pl-4">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-semibold block">{user.full_name || "Console User"}</span>
                <span className="text-[9px] font-bold text-purple-400 block uppercase tracking-wider">{user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 transition-all"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
