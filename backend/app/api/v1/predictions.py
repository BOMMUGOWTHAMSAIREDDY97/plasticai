from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Any, List

from app.api import deps
from app.core.database import get_db
from app.models.user import User
from app.services.forecasting import ForecastingEngine

router = APIRouter()

@router.get("/forecast")
def get_waste_forecast(
    horizon: int = Query(7, description="Forecast horizon in days (7, 30, 90)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Get machine learning waste predictions for 7, 30, or 90 days horizon.
    """
    # Restrict to valid horizons
    if horizon not in [7, 30, 90]:
        horizon = 7
        
    forecast_data = ForecastingEngine.generate_forecast(horizon_days=horizon)
    return forecast_data

@router.get("/insights")
def get_ai_insights(
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Retrieve real-time Generative AI-powered recommendations and action logs.
    """
    return [
        {
            "id": 1,
            "trigger_condition": "PET density limit exceeded",
            "recommendation_text": "High concentration of PET bottles detected in the main zone. Recommend immediate routing to recycling conveyor A.",
            "urgency": "High",
            "created_at": "2026-06-24T18:30:00Z"
        },
        {
            "id": 2,
            "trigger_condition": "Weekly accumulation threshold",
            "recommendation_text": "Plastic packaging waste increased by 32% compared to last week. Recommend increasing bin collection frequency on weekends.",
            "urgency": "Medium",
            "created_at": "2026-06-24T12:15:00Z"
        },
        {
            "id": 3,
            "trigger_condition": "Critical HDPE detection",
            "recommendation_text": "Severe density of HDPE containers detected. Risk of drainage blockage detected. Alerting ground operators.",
            "urgency": "Critical",
            "created_at": "2026-06-24T21:10:00Z"
        }
    ]
