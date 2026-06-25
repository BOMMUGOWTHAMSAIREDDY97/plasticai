"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";

export default function WebcamScanner({ onDetections }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const wsRef = useRef(null);

  const processFrame = useCallback(() => {
    if (webcamRef.current && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        wsRef.current.send(imageSrc);
      }
    }
  }, []);

  useEffect(() => {
    // Connect to WebSocket
    const connectWs = () => {
      const ws = new WebSocket("ws://localhost:8000/ws/video");
      
      ws.onopen = () => {
        console.log("Connected to Vision Service");
        setIsProcessing(true);
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.detections) {
          onDetections(data.detections);
          drawDetections(data.detections);
        }
      };
      
      ws.onclose = () => {
        console.log("Disconnected from Vision Service");
        setIsProcessing(false);
        // Attempt to reconnect
        setTimeout(connectWs, 3000);
      };
      
      wsRef.current = ws;
    };

    connectWs();

    // Start sending frames
    const intervalId = setInterval(processFrame, 200); // 5 FPS for now to avoid overloading

    return () => {
      clearInterval(intervalId);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [processFrame, onDetections]);

  const drawDetections = (detections) => {
    if (!canvasRef.current || !webcamRef.current || !webcamRef.current.video) return;

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    detections.forEach((det) => {
      const [x1, y1, x2, y2] = det.box;
      const width = x2 - x1;
      const height = y2 - y1;
      
      // Draw bounding box
      ctx.strokeStyle = "#10b981"; // primary color
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, width, height);
      
      // Draw label background
      ctx.fillStyle = "#10b981";
      const labelText = `${det.class_name} ${Math.round(det.confidence * 100)}%`;
      ctx.font = "16px Inter, sans-serif";
      const textWidth = ctx.measureText(labelText).width;
      ctx.fillRect(x1, y1 - 25, textWidth + 10, 25);
      
      // Draw label text
      ctx.fillStyle = "#ffffff";
      ctx.fillText(labelText, x1 + 5, y1 - 7);
    });
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-glassBorder shadow-lg">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "environment" }}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-10 pointer-events-none"
      />
      
      {!isProcessing && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-warning/20 text-warning text-sm font-medium border border-warning/50 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-warning animate-pulse" /> Connecting to AI...
        </div>
      )}
      {isProcessing && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/50 flex items-center gap-2 live-pulse">
          <span className="w-2 h-2 rounded-full bg-primary" /> AI Active
        </div>
      )}
    </div>
  );
}
