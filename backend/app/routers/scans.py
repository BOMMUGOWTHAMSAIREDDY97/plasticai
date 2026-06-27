import os
import base64
import time
import urllib.request
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
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

# Email Configuration
# WARNING: It's best to put these in your environment variables (.env)
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "your_email@gmail.com")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "your_app_password")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin_email@gmail.com")

def send_admin_email(report: models.ScanReport):
    """Sends an email notification to the admin with the new scan data."""
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = ADMIN_EMAIL
        msg['Subject'] = f"New Plastic Scan Report: {report.location_name}"

        body = f"""
        A new scan report has been submitted!
        
        Details:
        - User ID: {report.user_id}
        - Location: {report.location_name} (Lat: {report.latitude}, Lon: {report.longitude})
        - Plastic Percentage: {report.plastic_percentage}%
        - Image URL: {report.image_url}
        """
        msg.attach(MIMEText(body, 'plain'))

        # Connect to the SMTP server and send
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls() # Secure the connection
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        print("Admin notification email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")

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
            
        from ..services import vision
        
        # 3. Analyze image & Geocode using real OpenCV DNN Model
        detections = vision.process_frame(report_in.image_base64)
        
        # Calculate garbage density based on actual objects detected
        # e.g., 20% density per detected bottle, starting at a base of 5%
        bottle_count = len(detections)
        actual_percentage = min(99.0, (bottle_count * 25.0) + 5.0) 

        
        location_name = reverse_geocode(report_in.latitude, report_in.longitude)

        # 4. Save report to DB
        new_report = models.ScanReport(
            user_id=current_user.id,
            image_url=f"/static/uploads/{filename}",
            latitude=report_in.latitude,
            longitude=report_in.longitude,
            location_name=location_name,
            plastic_percentage=actual_percentage,
            status="processed"
        )
        db.add(new_report)
        db.commit()
        db.refresh(new_report)

        # 5. Send email to admin
        # Using a background thread to prevent blocking the API response
        import threading
        email_thread = threading.Thread(target=send_admin_email, args=(new_report,))
        email_thread.start()

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
