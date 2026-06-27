"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Camera, Shield, Leaf, Globe, Sparkles, Zap, Server } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-slate-200 overflow-hidden font-sans selection:bg-primary/30">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-[150px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[150px]" 
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
            <span className="text-sm text-emerald-300 font-medium tracking-wide uppercase">Next-Gen Environmental Intelligence</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-8 text-white">
            See the unseen. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
              Eradicate plastic waste.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Transform standard camera feeds into powerful environmental sensors. Our enterprise-grade vision AI detects, classifies, and tracks plastic pollution with unprecedented precision.
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
            <p className="text-slate-400 max-w-2xl mx-auto text-xl font-light">The complete toolkit for modern, AI-driven waste management.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Camera, title: "Neural Recognition", desc: "Live video stream analysis powered by hyper-optimized YOLOv8 for instantaneous plastic footprinting." },
              { icon: BarChart3, title: "Deep Analytics", desc: "Interactive intelligence dashboards featuring real-time heatmaps, historical trends, and risk scoring." },
              { icon: Globe, title: "Planetary Scale", desc: "Cloud-native predictive modeling and automated reporting engineered for global strategic deployments." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] group-hover:bg-emerald-500/20 transition-all duration-500" />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="w-full max-w-7xl mx-auto mt-40 px-4">
          <div className="bg-gradient-to-br from-blue-900/20 to-emerald-900/20 rounded-[3rem] p-10 md:p-20 border border-white/10 relative overflow-hidden backdrop-blur-md">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-white">Driving Real <span className="font-light text-cyan-400">Change</span></h2>
                <p className="text-xl text-slate-300 mb-10 leading-relaxed font-light">
                  We built PlasticVision AI to empower municipalities with undeniable data. By transitioning from reactive cleanup to proactive interception, we can stop plastic pollution at its source.
                </p>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30"><Leaf className="w-7 h-7 text-cyan-400" /></div>
                    <div>
                      <h4 className="text-2xl font-bold text-white">Optimize Operations</h4>
                      <p className="text-slate-400">Drastically reduce reliance on manual waste inspection</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30"><Shield className="w-7 h-7 text-cyan-400" /></div>
                    <div>
                      <h4 className="text-2xl font-bold text-white">Surgical Precision</h4>
                      <p className="text-slate-400">Powered by state-of-the-art computer vision models</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div className="bg-white/[0.03] p-8 rounded-3xl text-center border border-white/10 hover:border-cyan-500/30 transition-colors">
                    <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">Fast</div>
                    <div className="text-sm text-cyan-200 font-medium tracking-wide uppercase">Real-Time Inference</div>
                 </div>
                 <div className="bg-white/[0.03] p-8 rounded-3xl text-center border border-white/10 hover:border-cyan-500/30 transition-colors mt-12">
                    <Server className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">Cloud</div>
                    <div className="text-sm text-cyan-200 font-medium tracking-wide uppercase">Accessible Anywhere</div>
                 </div>
                 <div className="bg-white/[0.03] p-8 rounded-3xl text-center border border-white/10 hover:border-cyan-500/30 transition-colors">
                    <Camera className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">24/7</div>
                    <div className="text-sm text-cyan-200 font-medium tracking-wide uppercase">Continuous Vision</div>
                 </div>
                 <div className="bg-white/[0.03] p-8 rounded-3xl text-center border border-white/10 hover:border-cyan-500/30 transition-colors mt-12">
                    <BarChart3 className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">Smart</div>
                    <div className="text-sm text-cyan-200 font-medium tracking-wide uppercase">Automated Reports</div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section id="technology" className="w-full max-w-7xl mx-auto mt-40 mb-32 px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">The <span className="font-light text-emerald-400">Architecture</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-xl font-light">Engineered from the ground up for massive throughput and zero-downtime reliability.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="bg-black/40 p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">YOLOv8</h3>
                <p className="text-slate-400 leading-relaxed font-light">The pinnacle of object detection, optimized using TensorRT for sub-millisecond edge inference.</p>
             </div>
             <div className="bg-black/40 p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">FastAPI</h3>
                <p className="text-slate-400 leading-relaxed font-light">Asynchronous Python microservices crunching thousands of heavy tensor operations concurrently.</p>
             </div>
             <div className="bg-black/40 p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">Next.js 14</h3>
                <p className="text-slate-400 leading-relaxed font-light">React Server Components delivering a buttery-smooth, deeply interactive command center.</p>
             </div>
             <div className="bg-black/40 p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">Cloud Native</h3>
                <p className="text-slate-400 leading-relaxed font-light">Fully containerized topology orchestrating seamlessly across AWS, GCP, or bare-metal edge nodes.</p>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
