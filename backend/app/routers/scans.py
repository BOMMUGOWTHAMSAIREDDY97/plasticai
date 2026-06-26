import os
import base64
import time
import urllib.request
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, auth, database

router = APIRouter(prefix="/scans", tags=["Scans"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Directory to save scan images locally
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def reverse_geocode(lat, lon):
    if not lat or not lon:
        return "Location not provided"
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}"
        req = urllib.request.Request(url, headers={'User-Agent': 'PlasticVision/1.0 (Testing)'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            if 'address' in data:
                addr = data['address']
                village = addr.get('village') or addr.get('town') or addr.get('suburb') or addr.get('city') or addr.get('county')
                state = addr.get('state') or addr.get('country')
                if village and state:
                    return f"{village}, {state}"
                elif village:
                    return village
                return data.get('display_name', "Unknown Location")
            return "Unknown Location"
    except Exception as e:
        print(f"Geocoding error: {e}")
        return "Location lookup failed"

@router.post("/capture", response_model=schemas.ScanReportOut)
def capture_scan(
    report_in: schemas.ScanReportCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Receives an image payload from the camera, runs analysis to determine
    plastic percentage, saves the image, and stores the report.
    """
    try:
        # 1. Decode base64 image
        header, encoded = report_in.image_base64.split(",", 1)
        image_data = base64.b64decode(encoded)
        
        # 2. Save image locally
        filename = f"{current_user.id}_{int(time.time())}.jpg"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(image_data)
            
        # 3. Analyze image & Geocode
        # Calculate garbage density based on file size so bigger/more complex images score higher
        file_size_kb = len(image_data) / 1024
        mock_percentage = min(99.0, max(5.0, (file_size_kb / 500) * 100)) # e.g. 250KB = 50%
        
        location_name = reverse_geocode(report_in.latitude, report_in.longitude)

        # 4. Save report to DB
        new_report = models.ScanReport(
            user_id=current_user.id,
            image_url=f"/static/uploads/{filename}",
            latitude=report_in.latitude,
            longitude=report_in.longitude,
            location_name=location_name,
            plastic_percentage=mock_percentage,
            status="processed"
        )
        db.add(new_report)
        db.commit()
        db.refresh(new_report)

        return new_report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/my-reports", response_model=List[schemas.ScanReportOut])
def get_my_reports(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve all scan reports for the currently authenticated customer.
    """
    reports = db.query(models.ScanReport).filter(models.ScanReport.user_id == current_user.id).order_by(models.ScanReport.created_at.desc()).all()
    return reports


@router.get("/admin-reports", response_model=List[schemas.ScanReportOut])
def get_admin_reports(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve all scan reports (Admin only).
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    reports = db.query(models.ScanReport).order_by(models.ScanReport.created_at.desc()).all()
    return reports
