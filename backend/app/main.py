from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, detections, analytics, scans

# Create database tables
Base.metadata.create_all(bind=engine)

import subprocess
import os

# Download AI models if they don't exist
try:
    subprocess.run(["python", os.path.join(os.path.dirname(os.path.dirname(__file__)), "download_model.py")], check=True)
except Exception as e:
    print(f"Model download failed: {e}")

app = FastAPI(
    title="PlasticVision AI",
    description="Production-grade AI platform for real-time plastic waste detection and analytics",
    version="1.0.0"
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
    allow_origin_regex="https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .routers import auth, detections, analytics, scans, video

# Include routers
app.include_router(auth.router)
app.include_router(detections.router)
app.include_router(analytics.router)
app.include_router(scans.router)
app.include_router(video.router)

import os
os.makedirs("uploads", exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to PlasticVision AI API"}
