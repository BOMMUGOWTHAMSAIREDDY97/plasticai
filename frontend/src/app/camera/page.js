"use client";

import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";

export default function CameraPage() {
  const [streaming, setStreaming] = useState(false);
  const [activeDetections, setActiveDetections] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [wsStatus, setWsStatus] = useState("disconnected");
  const [errorMsg, setErrorMsg] = useState("");
  const [locationLabel, setLocationLabel] = useState("Gate 1 Webcam");
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const frameIntervalRef = useRef(null);

  // Stop stream and clean up when leaving the page
  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, []);

  const startStreaming = async () => {
    setErrorMsg("");
    try {
      // Connect to WebSocket first
      const wsUrl = `wss://plasticai.onrender.com/api/v1/detections/live`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setWsStatus("connected");
        initWebcam();
      };

      wsRef.current.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.status === "success") {
          // Render the annotated frame
          if (imgRef.current) {
            imgRef.current.src = response.annotated_frame;
          }
          setActiveDetections(response.detections);
          setActiveCount(response.active_count);
        }
      };

      wsRef.current.onclose = () => {
        setWsStatus("disconnected");
        stopStreaming();
      };

      wsRef.current.onerror = (err) => {
        setErrorMsg("WebSocket connection failed. Ensure the FastAPI backend is running.");
        stopStreaming();
      };

    } catch (err) {
      setErrorMsg("Failed to start scanner interface: " + err.message);
      stopStreaming();
    }
  };

  const initWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "environment" },
        audio: false
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setStreaming(true);
      
      // Canvas encoder loop (10 frames per second to prevent network congestion)
      frameIntervalRef.current = setInterval(sendFrame, 100);
      
    } catch (err) {
      setErrorMsg("Permission to access webcam was denied or no camera found.");
      if (wsRef.current) wsRef.current.close();
      stopStreaming();
    }
  };

  const sendFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ws = wsRef.current;

    if (!video || !canvas || !ws || ws.readyState !== WebSocket.OPEN) return;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Compress frame to JPEG and encode to base64
    const frameDataB64 = canvas.toDataURL("image/jpeg", 0.7);
    
    const payload = {
      frame: frameDataB64,
      location: locationLabel
    };
    
    ws.send(json_stringify_safe(payload));
  };

  // Helper to prevent circular json conversions
  const json_stringify_safe = (obj) => {
    return JSON.stringify(obj);
  };

  const stopStreaming = () => {
    setStreaming(false);
    
    // Stop intervals
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    
    // Stop camera tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    
    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setWsStatus("disconnected");
    
    // Reset output image source
    if (imgRef.current) {
      imgRef.current.src = "";
    }
    setActiveDetections([]);
    setActiveCount(0);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Live Scanning Console</h1>
          <p className="text-xs text-slate-400">Stream webcam frames directly for material classification and logging.</p>
        </div>
        
        {/* Status indicator badges */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">CONNECTION:</span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
            wsStatus === "connected" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${wsStatus === "connected" ? "bg-emerald-400 live-pulse" : "bg-rose-400"}`} />
            {wsStatus === "connected" ? "LINKED TO ENGINE" : "OFFLINE"}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs text-rose-400 font-semibold mb-6 text-center">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Main Grid: Streaming on left, details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Video Canvas Container */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="aspect-video w-full rounded-2xl border border-white/10 bg-slate-900 overflow-hidden relative shadow-2xl flex items-center justify-center">
            
            {/* Hidden items for frame acquisition */}
            <video ref={videoRef} className="hidden" width="640" height="480" playsInline muted />
            <canvas ref={canvasRef} className="hidden" width="640" height="480" />

            {/* Render Output Image (Annotated by FastAPI) */}
            {streaming ? (
              <img ref={imgRef} className="w-full h-full object-cover z-10" alt="Annotated Stream" />
            ) : (
              <div className="text-center p-8 text-slate-400 z-0">
                <span className="text-6xl mb-4 block">📷</span>
                <p className="font-bold text-slate-200">Scanner Standby</p>
                <p className="text-xs max-w-sm mt-2">Activate camera stream to connect frames to the computer vision engine.</p>
              </div>
            )}

            {/* Camera Overlay Layer */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
          </div>

          {/* Controls Bar */}
          <div className="glass-card p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-400 font-medium">Node Label:</label>
              <input
                type="text"
                value={locationLabel}
                onChange={(e) => setLocationLabel(e.target.value)}
                disabled={streaming}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-semibold focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50 text-slate-300"
              />
            </div>

            <div className="flex gap-3">
              {streaming ? (
                <button
                  onClick={stopStreaming}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-semibold text-xs text-white transition-all shadow-lg shadow-rose-600/25"
                >
                  🛑 Disconnect Scanner
                </button>
              ) : (
                <button
                  onClick={startStreaming}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-semibold text-xs text-white transition-all glow-btn-purple"
                >
                  ⚡ Start Camera Stream
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active stats counter card */}
          <div className="glass-card p-6 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Frame Detections</span>
            <div className="text-5xl font-black mt-2 font-mono text-purple-400">{activeCount}</div>
            <p className="text-[10px] text-slate-500 mt-2">Detections registered are automatically indexed for trend forecasting.</p>
          </div>

          {/* Detection Items Log list */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Tracked Objects</h3>
            
            {activeDetections.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {activeDetections.map((det, idx) => {
                  const borderColors = [
                    "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
                    "border-blue-500/20 bg-blue-500/5 text-blue-400",
                    "border-purple-500/20 bg-purple-500/5 text-purple-400",
                    "border-yellow-500/20 bg-yellow-500/5 text-yellow-400",
                    "border-rose-500/20 bg-rose-500/5 text-rose-400"
                  ];
                  return (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-between ${
                        borderColors[idx % borderColors.length]
                      }`}
                    >
                      <span>{det.tracking_id}</span>
                      <span className="font-mono text-[10px]">{(det.confidence * 100).toFixed(0)}% Conf</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No active objects tracked in frame.
              </div>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}
