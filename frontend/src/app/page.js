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
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-textSecondary">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#impact" className="hover:text-primary transition-colors">Impact</Link>
          <Link href="#technology" className="hover:text-primary transition-colors">Technology</Link>
        </div>
        <div className="flex items-center gap-4">
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

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-24">
          {[
            { icon: Camera, title: "Real-time Detection", desc: "Live video stream analysis powered by YOLOv8 for instantaneous plastic recognition." },
            { icon: BarChart3, title: "Advanced Analytics", desc: "Comprehensive dashboards with heatmaps, trends, and environmental risk scoring." },
            { icon: Globe, title: "Global Impact", desc: "Predictive modeling and automated reporting for strategic waste management." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + (i * 0.1) }}
              className="p-8 rounded-2xl glass-card text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-textSecondary leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
