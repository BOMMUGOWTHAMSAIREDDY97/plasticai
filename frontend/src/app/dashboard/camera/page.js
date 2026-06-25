"use client";

import { useState } from "react";
import WebcamScanner from "@/components/WebcamScanner";
import { Camera, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LiveCamera() {
  const [currentDetections, setCurrentDetections] = useState([]);

  const handleDetections = (detections) => {
    setCurrentDetections(detections);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Live Camera Feed</h1>
          <p className="text-textSecondary">Real-time object detection powered by YOLOv8</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-2 flex flex-col">
          <WebcamScanner onDetections={handleDetections} />
        </div>

        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl glass-card flex-1"
          >
            <div className="flex items-center gap-2 mb-6">
              <Camera className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Live Detections</h3>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {currentDetections.length === 0 ? (
                <div className="text-center py-12 text-textSecondary flex flex-col items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 mb-3 text-primary/50" />
                  <p>No plastic waste detected.</p>
                  <p className="text-sm">Scanning environment...</p>
                </div>
              ) : (
                currentDetections.map((det, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-surface/80 border border-glassBorder flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                      <span className="font-medium text-white">{det.class_name}</span>
                    </div>
                    <span className="text-sm text-textSecondary font-mono">
                      {Math.round(det.confidence * 100)}% conf
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl glass-card bg-primary/5 border-primary/20"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">Status</h4>
                <p className="text-sm text-textSecondary">
                  Camera feed is active and analyzing at ~5 FPS. 
                  Currently focusing on PET Bottles for MVP demonstration.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
