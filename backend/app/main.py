from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
import base64
import numpy as np
import cv2
from .database import engine, Base
from .routers import auth, dashboard, analytics, locations, reports, admin, scans
from .services.inference import process_frame

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PlasticVision AI Dashboard",
    description="Enterprise-grade analytics, mapping, and decision support dashboard for plastic waste management.",
    version="2.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://plasticai.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files to serve uploaded scan images
app.mount("/static/uploads", StaticFiles(directory="uploads"), name="static")

# Include routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(analytics.router)
app.include_router(locations.router)
app.include_router(reports.router)
app.include_router(admin.router)
app.include_router(scans.router)


@app.websocket("/ws/video")
async def websocket_video(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive image frame as base64 string from frontend
            data = await websocket.receive_text()
            if not data:
                continue
            
            # Strip base64 headers if present
            if "," in data:
                encoded = data.split(",", 1)[1]
            else:
                encoded = data
                
            try:
                image_bytes = base64.b64decode(encoded)
                # Run inference and track objects
                detections_list, annotated_bytes = process_frame(image_bytes)
                
                # Get frame dimensions to denormalize the coordinates
                nparr = np.frombuffer(image_bytes, np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                if frame is not None:
                    height, width, _ = frame.shape
                else:
                    height, width = 480, 640  # default fallback
                
                formatted_detections = []
                for det in detections_list:
                    # process_frame tracked_detections has normalized x, y, w, h
                    x1 = int(det["x"] * width)
                    y1 = int(det["y"] * height)
                    x2 = int((det["x"] + det["w"]) * width)
                    y2 = int((det["y"] + det["h"]) * height)
                    
                    formatted_detections.append({
                        "class_name": det["class_name"],
                        "confidence": det["confidence"],
                        "box": [x1, y1, x2, y2]
                    })
                
                # Send result back to the frontend
                await websocket.send_text(json.dumps({
                    "detections": formatted_detections
                }))
            except Exception:
                # Silently catch frames processing errors to keep stream alive
                pass
    except WebSocketDisconnect:
        pass
    except Exception:
        pass

@app.get("/")
def read_root():
    return {"message": "Welcome to PlasticVision AI Dashboard API"}

