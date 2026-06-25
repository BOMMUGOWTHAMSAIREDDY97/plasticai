# PlasticVision AI

PlasticVision AI is a world-class, AI-powered environmental monitoring platform that detects, classifies, tracks, analyzes, and reports plastic waste in real time using browser cameras or remote video feeds. Built for municipalities, smart cities, recycling plants, and environmental NGOs.

---

## Architecture Overview

- **Frontend**: Next.js (React) + Tailwind CSS + Custom SVG Visualizations. Includes a premium dark-mode glassmorphic user console.
- **Backend**: FastAPI + SQLAlchemy (SQLite by default, PostgreSQL-ready) + OpenCV and YOLOv8 inference engines.
- **Inference**: Support for dual-mode execution (direct YOLOv8 CPU/GPU inference with high-fidelity CPU simulated computer vision tracking fallback).
- **Security**: JWT-based token authentication and role-based permissions (Admin, Researcher, Operator, Viewer).

---

## Directory Structure

```
plastic/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/              # Routes & Dependencies
│   │   ├── core/             # Security, Database, config
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   └── services/         # CV Inference, Forecasting, Reports
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile
├── frontend/                 # Next.js Application
│   ├── src/
│   │   ├── app/              # App Router Pages (Home, Dashboard, Camera, Reports)
│   │   └── components/       # UI & Navigation elements
│   ├── package.json          # Node dependencies
│   └── Dockerfile
├── docker-compose.yml        # Multi-container orchestrator
└── README.md
```

---

## Local Setup & Quickstart

### Method 1: Local Development (Recommended)

#### Step 1: Run the Backend
1. Navigate to the `backend/` directory.
2. Create and activate a python virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate   # Windows
   source venv/bin/activate  # macOS/Linux
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server using Uvicorn:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
5. Verify API docs by visiting: `http://localhost:8000/api/v1/docs`

#### Step 2: Run the Frontend
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser: `http://localhost:3000`

---

### Method 2: Docker Compose

You can build and spin up the entire application stack using a single command:

```bash
docker-compose up --build
```

Access the frontend at `http://localhost:3000` and the backend Swagger documentation at `http://localhost:8000/api/v1/docs`.

---

## Security & Access Credentials

The database automatically seeds a default superuser credentials on first run. Use the details below to log in:

- **Email**: `admin@plasticvision.ai`
- **Password**: `admin123`
- **Role**: `Admin`

---

## Key Feature Highlights

1. **Live Camera Scanner**: Accessible under the `Live Stream` tab, this links user webcams to a backend WebSocket pipeline, running frame-by-frame coordinate tracking, generating trajectories, and returning annotated frames.
2. **Predictive Forecasting**: Forecasting models predict plastic waste growth and environmental risk curves across 7, 30, and 90-day intervals.
3. **Auditable Reports**: Generates and downloads custom PDF Executive Summaries, Excel spreadsheets, and flat CSV logs of tracked debris.
