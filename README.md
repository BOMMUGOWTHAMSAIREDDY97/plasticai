# 🌿 PlasticVision AI

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.2+-black.svg?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-00599C.svg?style=for-the-badge&logo=opencv&logoColor=white)](https://ultralytics.com)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Enterprise-Grade AI Environmental Intelligence, Real-Time Plastic Waste Detection, Geospatial GIS Mapping, and Circular Economy Decision Support Platform.**

[Features](#-key-features) • [Architecture](#-system-architecture) • [Getting Started](#-getting-started) • [API Reference](#-complete-api-reference) • [Taxonomy](#-supported-plastic-taxonomy) • [Deployment](#-deployment)

</div>

---

## 📌 Executive Overview

**PlasticVision AI** is a state-of-the-art environmental intelligence and computer vision platform engineered to combat global plastic pollution. By unifying edge computer vision (YOLOv8), bidirectional WebSocket video streaming, GIS geospatial telemetry, and time-series forecasting, PlasticVision AI provides municipalities, smart city administrators, recycling facilities, and NGOs with end-to-end visibility over the entire plastic waste lifecycle.

From real-time webcam detection of single-use plastics to pan-India municipal collection tracking and automated executive PDF audits, PlasticVision AI turns raw visual streams and facility telemetry into quantifiable ecological impact.

---

## ✨ Key Features

### 🎥 1. Real-Time Edge & Browser AI Scanner
- **Zero-Latency WebSocket Stream (`/ws/video`)**: Streams browser webcam frames encoded as base64 directly to the backend vision engine.
- **YOLOv8 Neural Detection**: High-accuracy detection of plastic bottles, cups, containers, cutlery, and packaging materials.
- **Centroid-Based Motion Tracker**: Computes Euclidean distance centroids across frames to generate continuous object trajectories, frame persistence counts, and dynamic bounding boxes.
- **Heuristic Fallback Engine**: If PyTorch/CUDA acceleration is unavailable, an automated OpenCV computer vision fallback activates seamlessly to ensure uninterrupted monitoring.

### 📸 2. Geotagged Incident Reporting & Mobile Capture
- **HTML5 Geolocation Integration**: Captures precise GPS coordinates (Latitude & Longitude) alongside snapshot evidence.
- **Automated Reverse Geocoding**: Resolves coordinates into localized human-readable street and district names.
- **Debris Density Assessment**: Calculates plastic coverage percentages from image segmentations.
- **Automated Dispatch & SMTP Alerts**: Instantly triggers email notifications to municipal response teams upon reporting hazardous plastic dumps.

### 🗺️ 3. Geospatial GIS Facility Map (Leaflet.js)
- **Pan-India Monitoring Network**: Pre-seeded coordinates covering all **36 States and Union Territories of India**.
- **Facility Clustering & Status Filters**: Toggle between **Collection Centers** and **Polymer Recycling Plants**.
- **Interactive Telemetry Modals**: Inspect live facility capacity, current load (kg), operational efficiency (%), and geographical coordinates.

### 🔄 4. Material Flow Stream (Sankey-Style Flow)
- Tracks waste migration through the entire municipal lifecycle:
  $$\text{Collection Centers} \longrightarrow \text{Sorting Facilities} \longrightarrow \begin{cases} \text{Recycling Plants} & (\approx 65\%) \\ \text{Waste-to-Energy (WtE)} & (\approx 18\%) \\ \text{Sanitary Landfills} & (\approx 12\%) \\ \text{Rejected / Slag} & (\approx 5\%) \end{cases}$$
- Provides instant visibility into sorting contamination rates and leakage hotspots.

### 📈 5. Circular Economy & ESG Analytics
- **Material Recovery & Purity Rates**: Real-time measurement of mechanical recycling yields.
- **Carbon Offset Metrics**: Computes metric tons of greenhouse gas emissions avoided ($\text{kg CO}_2\text{e saved}$) by diverting plastics from incineration.
- **Economic Value Estimation**: Estimates scrap recovery commodity revenue in USD based on current polymer market rates.

### 🔮 6. Time-Series AI Waste Forecasting
- Multi-horizon predictive curves across **7-day, 30-day, and 90-day** operational intervals.
- Incorporates compound growth trends, seasonal weekend surges, and expanding confidence uncertainty bands.
- Outputs an **Environmental Risk Index (0–100)** to assist municipal resource allocation.

### 💡 7. Automated Policy & Action Directives
- Rule-based AI insight engine evaluates facility throughput against historical moving averages.
- Generates categorized notifications (**Success**, **Warning**, **Critical**) paired with concrete policy directives (e.g., rerouting collection fleets, scheduling depot expansions).

### 📑 8. Multi-Format Audit & Compliance Center
- **Executive PDF Summaries**: Generated dynamically via `ReportLab` with formatted tables, status badges, and executive signatures.
- **Excel Workbooks (`.xlsx`)**: Structured, multi-tab spreadsheets built using `openpyxl`.
- **Raw CSV Logs**: Instant streaming export for ingest into third-party business intelligence (PowerBI, Tableau) pipelines.

### 🛡️ 9. Dual Authentication & Role-Based Access Control (RBAC)
- Multi-tier security supporting **Firebase Authentication** alongside native **OAuth2 / JWT Token Bearer** schemes.
- Role management supporting **Admin**, **Operator**, and **Viewer** privilege levels.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Client (Next.js 16 / React 19)"]
        UI["Glassmorphic UI / Tailwind CSS"]
        Cam["Webcam Scanner (react-webcam)"]
        Map["GIS Map (Leaflet.js)"]
        Charts["Analytics & Flow (Chart.js)"]
    end

    subgraph Gateway["Communication Layer"]
        REST["REST API (HTTP/JSON)"]
        WS["WebSocket Pipeline (/ws/video)"]
    end

    subgraph Server["Backend Core (FastAPI / Python 3.10+)"]
        Router["FastAPI APIRouter Engine"]
        AuthService["JWT & Firebase Auth Service"]
        
        subgraph Vision["AI & Intelligence Subsystem"]
            YOLO["YOLOv8n Neural Inference"]
            Tracker["Centroid-Based Object Tracker"]
            Forecaster["Time-Series Forecasting Engine"]
            Insights["Policy & Insight Generator"]
        end

        subgraph Exporter["Reporting Subsystem"]
            PDFGen["ReportLab PDF Engine"]
            ExcelGen["OpenPyXL Spreadsheet Engine"]
        end
    end

    subgraph Data["Persistence & Storage"]
        DB[(SQLite / PostgreSQL DB)]
        Uploads["Local / Static Asset Storage"]
    end

    subgraph External["External Integrations"]
        SMTP["SMTP Mail Server (Admin Alerts)"]
        FB["Firebase Auth Cloud"]
    end

    Cam -->|Base64 Frames| WS
    UI -->|API Requests| REST
    REST --> Router
    WS --> YOLO
    YOLO --> Tracker
    Tracker -->|Detections & Boxes| WS
    Router --> AuthService
    AuthService <--> FB
    Router --> Vision
    Router --> Exporter
    Router <--> DB
    Router --> Uploads
    Router --> SMTP
    Exporter -->|Downloadable Binary| REST
    DB --> Charts
    DB --> Map
```

---

## 📂 Project Directory Structure

```text
plastic/
├── backend/                        # FastAPI Application
│   ├── app/
│   │   ├── api/                    # API v1 routes & dependencies
│   │   ├── core/                   # Security, JWT tokens, config & settings
│   │   ├── models/                 # Modular SQLAlchemy ORM models
│   │   │   ├── analysis.py
│   │   │   ├── detection.py
│   │   │   └── user.py
│   │   ├── routers/                # Endpoint controllers
│   │   │   ├── admin.py            # User management, facility CRUD, DB seeding
│   │   │   ├── analytics.py        # Trend analysis, recycling rates, carbon metrics
│   │   │   ├── auth.py             # Signup, login, Firebase sync, JWT tokens
│   │   │   ├── dashboard.py        # Executive KPI summaries, flow & insight endpoints
│   │   │   ├── locations.py        # GIS facility endpoints & coordinate feeds
│   │   │   ├── reports.py          # PDF, Excel, and CSV report generators
│   │   │   └── scans.py            # Geotagged scan ingestion, uploads, email alerts
│   │   ├── schemas/                # Pydantic v2 validation models
│   │   ├── services/               # Business logic & AI pipelines
│   │   │   ├── forecasting.py      # Statistical & predictive waste models
│   │   │   ├── inference.py        # YOLOv8 & OpenCV computer vision inference
│   │   │   ├── insights.py         # AI operational recommendations
│   │   │   └── reporting.py        # ReportLab and OpenPyXL generation logic
│   │   ├── auth.py                 # Core authentication helper routines
│   │   ├── database.py             # Engine, SessionLocal, Base declarations
│   │   ├── main.py                 # FastAPI application factory & WebSocket route
│   │   ├── models.py               # Root database schema definitions
│   │   └── schemas.py              # Root request & response validation schemas
│   ├── requirements.txt            # Python dependencies
│   └── Dockerfile                  # Container definition for backend
├── frontend/                       # Next.js 16 Web Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/              # Dedicated admin portals
│   │   │   ├── dashboard/          # Authenticated user dashboard
│   │   │   │   ├── admin/          # Facility registry & system seeding UI
│   │   │   │   ├── analytics/      # Deep-dive historical telemetry
│   │   │   │   ├── flow/           # Sankey waste distribution diagram
│   │   │   │   ├── insights/       # AI recommendations & policy directives
│   │   │   │   ├── map/            # Interactive Leaflet geospatial map
│   │   │   │   ├── profile/        # User credentials and settings
│   │   │   │   ├── recycling/      # Circular economy & ESG scorecards
│   │   │   │   ├── reports/        # Export center (PDF, XLSX, CSV)
│   │   │   │   ├── settings/       # Alert parameters and camera options
│   │   │   │   ├── layout.js       # Dashboard frame with navigation sidebar
│   │   │   │   └── page.js         # Main KPI metrics & live scanner hub
│   │   │   ├── login/              # User authentication page
│   │   │   ├── register/           # New account registration page
│   │   │   ├── globals.css         # Dark-mode glassmorphic Tailwind styles
│   │   │   ├── layout.js           # Root HTML layout & font definitions
│   │   │   └── page.js             # High-conversion public landing page
│   │   ├── components/             # Reusable UI widgets
│   │   │   ├── Navbar.js           # Top navigation bar
│   │   │   ├── Sidebar.js          # Persistent sidebar navigation
│   │   │   └── WebcamScanner.js    # Camera stream with WebSocket overlay
│   │   └── firebaseConfig.js       # Firebase client SDK initialization
│   ├── package.json                # Frontend scripts and npm packages
│   ├── tailwind.config.js          # Custom theme colors and blur settings
│   └── Dockerfile                  # Container definition for frontend
├── uploads/                        # Local file store for geotagged scan captures
├── docker-compose.yml              # Multi-container service orchestrator
├── plasticvision.db                # SQLite database (auto-created on first run)
├── run_dev.ps1                     # One-click Windows development bootstrapper
├── yolov8n.pt                      # YOLOv8 nano neural weights
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites

Ensure you have the following installed on your host system:
- **Python 3.10+** ([python.org](https://www.python.org/downloads/))
- **Node.js 18.0+** and **npm** ([nodejs.org](https://nodejs.org/))
- **Git** ([git-scm.com](https://git-scm.com/))
- *(Optional)* **Docker & Docker Compose** ([docker.com](https://www.docker.com/))

---

### Method 1: Local Development (Recommended)

#### 1. Clone the Repository
```bash
git clone https://github.com/BOMMUGOWTHAMSAIREDDY97/plasticai.git
cd plasticai
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate a Python virtual environment
# Windows:
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux:
python3 -m venv venv
source venv/bin/activate

# Install required dependencies
pip install -r requirements.txt

# Start the FastAPI development server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API is now accessible at:
- **API Base**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

#### 3. Frontend Setup
In a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start the Next.js development server
npm run dev
```
Open your browser and navigate to **`http://localhost:3000`**.

---

### Method 2: One-Click Windows Launcher

For Windows environments, a unified PowerShell script is provided to automatically boot both backend and frontend servers in parallel terminal sessions:

```powershell
.\run_dev.ps1
```

---

### Method 3: Containerized Deployment (Docker Compose)

To run the entire system in isolated containers:

```bash
docker-compose up --build
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **API Docs**: `http://localhost:8000/docs`

---

## 🔑 Default Credentials & Initial Seeding

On first initialization, the platform automatically provisions a superuser account:

| Attribute | Default Credential |
| :--- | :--- |
| **Email** | `admin@plasticvision.ai` |
| **Password** | `admin123` |
| **Role** | `Admin` |

### Seeding Rich Telemetry Data
To populate the database with realistic pan-India data (covering all 36 States/UTs, collection centers, recycling facilities, and 30-day collection histories):

1. Log into the dashboard with the admin credentials above.
2. Navigate to **Administration** (`/dashboard/admin`).
3. Click the **"Seed Pan-India Database"** button (or trigger `POST /admin/seed` via Swagger docs).

---

## 📡 Complete API Reference

### 🔐 Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/register` | Register a new user account | No |
| `POST` | `/auth/login` | Authenticate with credentials and obtain JWT | No |
| `POST` | `/auth/firebase-login` | Synchronize and verify Firebase Auth token | No |
| `GET` | `/auth/me` | Fetch profile information for the current user | Bearer Token |

---

### 📊 Dashboard & Metrics (`/dashboard`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/dashboard/summary` | Query aggregated metrics (collected, recycled, landfill, WtE) with state/city/category filters | Bearer Token |
| `GET` | `/dashboard/flow` | Sankey waste flow data (depot $\to$ sorting $\to$ processing) | Bearer Token |
| `GET` | `/dashboard/insights` | Real-time AI recommendations and policy directives | Bearer Token |

---

### 📈 Analytics & Circular Economy (`/analytics`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/analytics/trends` | Time-series historical trends (daily 7-day or monthly 12-month) | Bearer Token |
| `GET` | `/analytics/recycling` | Purity rates, recovery ratios, carbon offset ($kg\text{ }CO_2$), revenue | Bearer Token |

---

### 🗺️ Facilities & Locations (`/locations`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/locations` | Retrieve all collection centers and recycling plants with GPS lat/lon | Bearer Token |
| `GET` | `/locations/summary` | High-level summary of facility counts and operational capacities | Bearer Token |

---

### 📸 Scans & Detection (`/scans` & `/ws`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/scans/capture` | Upload image snapshot with latitude/longitude; sends SMTP alert | Bearer Token |
| `GET` | `/scans/my-reports` | List scan reports submitted by authenticated user | Bearer Token |
| `GET` | `/scans/all` | List all historical scan reports across the system | Admin/Operator |
| `WS` | `/ws/video` | Real-time bidirectional WebSocket stream for frame-by-frame YOLOv8 inference | Public / Stream |

---

### 📑 Reports & Downloads (`/reports`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/reports/list` | List all generated audit reports | Bearer Token |
| `POST` | `/reports/generate` | Queue creation of a new scheduled report | Bearer Token |
| `GET` | `/reports/download/pdf` | Download formatted Executive Summary PDF (`ReportLab`) | Bearer Token |
| `GET` | `/reports/download/xlsx`| Download formatted Excel workbook (`openpyxl`) | Bearer Token |
| `GET` | `/reports/download/csv` | Stream raw CSV data export | Bearer Token |

---

### 🛡️ Administration (`/admin`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/admin/stats` | System counts (facilities, logs, users) | Admin/Operator |
| `POST` | `/admin/seed` | Seed complete pan-India mock data across all 36 States/UTs | Admin/Operator |
| `POST` | `/admin/centers` | Register a new Collection Depot | Admin/Operator |
| `POST` | `/admin/plants` | Register a new Recycling Facility | Admin/Operator |

---

## 🏷️ Supported Plastic Taxonomy

PlasticVision AI classifies plastic materials using standardized international resin identification codes (RIC):

| Code | Polymer Name | Common Source Objects | Recyclability | Typical Fate |
| :---: | :--- | :--- | :---: | :--- |
| **#1** | **PET** (Polyethylene Terephthalate) | Water bottles, soda bottles, food jars | High (95%) | Bottle-to-bottle, polyester fiber |
| **#2** | **HDPE** (High-Density Polyethylene) | Milk jugs, detergent bottles, shampoo containers | High (90%) | Pipe extrusion, plastic lumber |
| **#4** | **LDPE** (Low-Density Polyethylene) | Grocery bags, shrink wraps, squeeze bottles | Moderate (60%) | Trash can liners, floor tiles |
| **#5** | **PP** (Polypropylene) | Bottle caps, yogurt tubs, take-out containers | Moderate (65%) | Auto battery cases, industrial fibers |
| **#7** | **OTHER** (Mixed / Multi-layer) | Multilayer food pouches, bioplastics, composite waste | Low (<15%) | Waste-to-Energy (WtE) or Landfill |

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)

```ini
# Application Core
PROJECT_NAME="PlasticVision AI"
SECRET_KEY="supersecretjwtkeyforplasticvisionai2026!!!"
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Database Configuration (SQLite default, PostgreSQL supported)
DATABASE_URL="sqlite:///./plasticvision.db"
# Example PostgreSQL:
# DATABASE_URL="postgresql://user:password@localhost:5432/plasticvision"

# Initial Superuser Seed
FIRST_SUPERUSER_EMAIL="admin@plasticvision.ai"
FIRST_SUPERUSER_PASSWORD="admin123"

# Email / SMTP Configuration (for automated incident alerts)
SMTP_SERVER="smtp.gmail.com"
SMTP_PORT=587
SENDER_EMAIL="your_email@gmail.com"
SENDER_PASSWORD="your_app_password"
ADMIN_EMAIL="admin@plasticvision.ai"
```

### Frontend Configuration (`frontend/.env.local`)

```ini
# Backend API Base URL
NEXT_PUBLIC_API_URL="http://localhost:8000"

# (Optional) Firebase Authentication
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
```

---

## 🚀 Deployment

### Cloud Deployment Strategy

```text
       [ User Browser ]
              │
              ▼
    [ Vercel / Cloudflare ] ──── (Frontend: Next.js)
              │
              │ REST / WebSocket
              ▼
   [ Render / AWS / Railway ] ── (Backend: FastAPI + YOLOv8)
              │
              ├── [ Managed PostgreSQL / SQLite ]
              ├── [ S3 / Local Static Uploads ]
              └── [ SMTP Notification Relay ]
```

- **Frontend Deployment (Vercel)**:
  1. Import the repository into [Vercel](https://vercel.com).
  2. Set Root Directory to `frontend`.
  3. Add environment variable `NEXT_PUBLIC_API_URL` pointing to your hosted FastAPI backend.
  4. Deploy.

- **Backend Deployment (Render / Railway / AWS EC2)**:
  1. Configure the build command: `pip install -r backend/requirements.txt`.
  2. Configure start command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`.
  3. Attach persistent volume storage for `/uploads` and SQLite database (or connect a managed PostgreSQL instance).

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Computer Vision** | [Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics) | Real-time object detection and plastic classification |
| **Image Processing**| [OpenCV](https://opencv.org/) | Frame transformation, image encoding, centroid tracking |
| **Backend Framework**| [FastAPI](https://fastapi.tiangolo.com/) | High-performance asynchronous REST & WebSocket API |
| **ASGI Server** | [Uvicorn](https://www.uvicorn.org/) | Lightning-fast ASGI HTTP/WebSocket server |
| **Database ORM** | [SQLAlchemy](https://www.sqlalchemy.org/) | Enterprise SQL abstraction & schema management |
| **Frontend Framework**| [Next.js 16](https://nextjs.org/) (App Router) | React 19 server and client component rendering |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Responsive glassmorphic dark-mode design system |
| **Motion** | [Framer Motion](https://www.framer.com/motion/) | Smooth UI transitions, ambient glows, and animations |
| **Data Visualization**| [Chart.js](https://www.chartjs.org/) + `react-chartjs-2` | Interactive line, bar, doughnut, and area graphs |
| **GIS Mapping** | [Leaflet.js](https://leafletjs.com/) | Interactive map tiles and custom facility markers |
| **Document Export** | [ReportLab](https://www.reportlab.com/) & [OpenPyXL](https://openpyxl.readthedocs.io/) | PDF generation & Excel workbook construction |
| **Authentication** | JWT (PyJWT / passlib) + [Firebase](https://firebase.google.com/) | Secure dual-mode identity verification and RBAC |
| **Containerization**| [Docker](https://www.docker.com/) & Docker Compose | Multi-container reproducible deployment |

---

## 🤝 Contributing

Contributions to PlasticVision AI are welcome! To contribute:

1. **Fork the Repository** on GitHub.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your Changes**:
   ```bash
   git commit -m "feat: Add high-resolution plastic segmentation model"
   ```
4. **Push to Branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

---

<div align="center">
  <sub>Developed for smarter cities, cleaner oceans, and a sustainable circular future.</sub>
</div>
