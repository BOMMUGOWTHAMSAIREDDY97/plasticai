from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

# Analytics
class AnalyticsBase(BaseModel):
    interval_start: datetime
    interval_end: datetime
    total_count: int
    average_density_score: float
    environmental_risk_score: float
    type_distribution_json: Optional[str] = None

class AnalyticsOut(AnalyticsBase):
    id: int

    class Config:
        from_attributes = True

# Custom Analytics Dashboard Summary Response
class DashboardSummary(BaseModel):
    total_plastic: int
    active_detections: int
    environmental_risk_score: float
    risk_level: str  # Low | Medium | High | Critical
    hourly_trends: List[Dict[str, Any]]
    type_distribution: Dict[str, int]
    recent_insights: List[str]

# Recommendation
class RecommendationBase(BaseModel):
    recommendation_text: str
    urgency: str # Low | Medium | High | Critical
    dismissed: bool = False

class RecommendationOut(RecommendationBase):
    id: int
    generated_at: datetime
    trigger_condition: Optional[str]

    class Config:
        from_attributes = True

# Forecast
class ForecastRequest(BaseModel):
    horizon_days: int = 7

class ForecastOut(BaseModel):
    id: int
    generated_at: datetime
    horizon_days: int
    predicted_counts_json: str
    confidence_intervals_json: Optional[str]

    class Config:
        from_attributes = True

# Report
class ReportRequest(BaseModel):
    report_type: str  # PDF | CSV | Excel
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class ReportOut(BaseModel):
    id: int
    created_at: datetime
    report_type: str
    file_url: str
    generated_by_user_id: Optional[int]

    class Config:
        from_attributes = True
