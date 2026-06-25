from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, detections, analytics

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PlasticVision AI",
    description="Production-grade AI platform for real-time plastic waste detection and analytics",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*" # For development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(detections.router)
app.include_router(analytics.router)
# app.include_router(video.router) # Temporarily commented out for fast installation

@app.get("/")
def read_root():
    return {"message": "Welcome to PlasticVision AI API"}
