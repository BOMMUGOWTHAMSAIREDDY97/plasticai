"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Shield, Leaf, Globe, Sparkles, GitBranch, Map } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans selection:bg-white/30">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.6, 0.8, 0.6],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/50 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.5, 0.7, 0.5],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-500/50 blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1], 
            opacity: [0.4, 0.6, 0.4],
            x: [0, 30, -30, 0]
          }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-fuchsia-500/40 blur-[130px]" 
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 bg-white/[0.02] backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">PlasticVision <span className="text-emerald-400 font-light">AI</span></span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-emerald-500/30 mb-8 backdrop-blur-sm cursor-default"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300 font-medium tracking-wide uppercase">Enterprise Waste Intelligence</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-8 text-white">
            See the flow. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
              Optimize circular recovery.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Empowering municipal authorities, smart cities, and recycling enterprises with real-time plastic waste monitoring, dynamic flow mapping, and data-driven decision support.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/register" className="w-full sm:w-auto px-10 py-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
              Start Building Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Features Section */}
        <section id="features" className="w-full max-w-7xl mx-auto mt-40 px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">Unmatched <span className="font-light text-emerald-400">Capabilities</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-xl font-light">The complete intelligence suite for modern circular waste logistics.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: GitBranch, title: "Interactive Flow Mapping", desc: "Track material movements in real-time from collection points down to sorting, recycling, and final containment sinks." },
              { icon: BarChart3, title: "Recycling Analytics", desc: "Monitor purity indices, estimated material revenues, and carbon savings offsets with enterprise precision." },
              { icon: Map, title: "Geographic Telemetry", desc: "Interact with localized mapping nodes indicating operational loads and active capacity rates of regional hubs." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm text-left hover:border-emerald-500/20 hover:bg-white/[0.04] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-xs text-slate-500 border-t border-white/5 bg-slate-950/20">
        <p>© {new Date().getFullYear()} PlasticVision AI Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}
