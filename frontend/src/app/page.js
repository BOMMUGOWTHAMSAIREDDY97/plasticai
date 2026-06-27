"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Camera, Shield, Leaf, Globe } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-textPrimary overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 glass-panel border-b border-glassBorder">
        <div className="flex items-center gap-2">
          <Leaf className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight">PlasticVision <span className="text-primary">AI</span></span>
        </div>

      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border border-primary/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Next-Gen Environmental Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            Detect. Analyze. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              Eradicate Plastic Waste.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-textSecondary mb-10 max-w-2xl mx-auto leading-relaxed">
            Enterprise-grade computer vision platform that detects, classifies, and tracks plastic waste in real-time using just a camera. 
            Empowering smart cities and environmental organizations with actionable data.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary hover:bg-primaryHover text-white font-semibold flex items-center justify-center gap-2 transition-all glow-btn-purple">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Features Section */}
        <section id="features" className="w-full max-w-7xl mx-auto mt-32 px-4 scroll-mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Core <span className="text-primary">Features</span></h2>
            <p className="text-textSecondary max-w-2xl mx-auto text-lg">Everything you need to deploy, monitor, and scale your plastic waste detection operations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Camera, title: "Real-time Detection", desc: "Live video stream analysis powered by YOLOv8 for instantaneous plastic recognition." },
              { icon: BarChart3, title: "Advanced Analytics", desc: "Comprehensive dashboards with heatmaps, trends, and environmental risk scoring." },
              { icon: Globe, title: "Global Impact", desc: "Predictive modeling and automated reporting for strategic waste management." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl glass-card text-left hover:border-primary/50 transition-colors group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-textSecondary leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="w-full max-w-7xl mx-auto mt-32 px-4 scroll-mt-24">
          <div className="glass-panel rounded-3xl p-8 md:p-16 border border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Measuring Our <span className="text-blue-400">Impact</span></h2>
                <p className="text-lg text-textSecondary mb-8 leading-relaxed">
                  By digitizing waste management, PlasticVision AI helps municipalities intercept plastic before it reaches our oceans. Our platform enables proactive rather than reactive environmental protection.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30"><Leaf className="w-6 h-6 text-blue-400" /></div>
                    <div>
                      <h4 className="text-xl font-bold">40% Reduction</h4>
                      <p className="text-sm text-textSecondary">in manual sorting time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30"><Shield className="w-6 h-6 text-blue-400" /></div>
                    <div>
                      <h4 className="text-xl font-bold">High Precision</h4>
                      <p className="text-sm text-textSecondary">95%+ accuracy in plastic classification</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="glass-card p-6 rounded-2xl text-center border border-blue-500/20">
                    <div className="text-4xl font-bold text-blue-400 mb-2">1M+</div>
                    <div className="text-sm text-textSecondary">Items Scanned</div>
                 </div>
                 <div className="glass-card p-6 rounded-2xl text-center border border-blue-500/20 mt-8">
                    <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
                    <div className="text-sm text-textSecondary">Cities Supported</div>
                 </div>
                 <div className="glass-card p-6 rounded-2xl text-center border border-blue-500/20">
                    <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
                    <div className="text-sm text-textSecondary">Continuous Monitoring</div>
                 </div>
                 <div className="glass-card p-6 rounded-2xl text-center border border-blue-500/20 mt-8">
                    <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
                    <div className="text-sm text-textSecondary">Automated</div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section id="technology" className="w-full max-w-7xl mx-auto mt-32 mb-32 px-4 scroll-mt-24 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Powered by <span className="text-primary">Advanced AI</span></h2>
          <p className="text-textSecondary max-w-2xl mx-auto text-lg mb-16">Built on a modern, scalable tech stack designed for speed and reliability.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="glass-card p-8 rounded-2xl border border-glassBorder hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-semibold mb-2">YOLOv8</h3>
                <p className="text-sm text-textSecondary">State-of-the-art object detection model optimized for real-time inference on edge devices.</p>
             </div>
             <div className="glass-card p-8 rounded-2xl border border-glassBorder hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-semibold mb-2">FastAPI</h3>
                <p className="text-sm text-textSecondary">Lightning-fast Python backend handling thousands of API requests and image processing tasks concurrently.</p>
             </div>
             <div className="glass-card p-8 rounded-2xl border border-glassBorder hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-semibold mb-2">Next.js</h3>
                <p className="text-sm text-textSecondary">React framework providing a highly responsive, server-rendered dashboard experience.</p>
             </div>
             <div className="glass-card p-8 rounded-2xl border border-glassBorder hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-semibold mb-2">Cloud Ready</h3>
                <p className="text-sm text-textSecondary">Containerized architecture ready to scale seamlessly across global cloud providers.</p>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
