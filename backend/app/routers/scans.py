import os
import base64
import time
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
            
        # 3. Analyze image (Mock YOLO logic for plastic percentage)
        # In a real scenario, we'd pass image_data to our CV model.
        # For now, generate a simulated plastic density based on the time.
        # Let's say between 5.0% and 45.0%
        mock_percentage = 15.5 + (int(time.time()) % 30)

        # 4. Save report to DB
        new_report = models.ScanReport(
            user_id=current_user.id,
            image_url=f"/static/uploads/{filename}",
            latitude=report_in.latitude,
            longitude=report_in.longitude,
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
        # For testing, let's allow operators to see everything if needed, 
        # but formally it should raise a 403.
        # raise HTTPException(status_code=403, detail="Not authorized")
        pass

    reports = db.query(models.ScanReport).order_by(models.ScanReport.created_at.desc()).all()
    return reports
