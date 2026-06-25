from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, database
from .auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary", response_model=schemas.AnalyticsData)
def get_analytics_summary(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    # In a real app, this would aggregate data. For now, return a mock or latest entry.
    analytics = db.query(models.Analytics).order_by(models.Analytics.date.desc()).first()
    if not analytics:
        return schemas.AnalyticsData(total_detections=0, environmental_risk_score=0.0, plastic_density=0.0, date="2026-06-25T00:00:00Z")
    return analytics
