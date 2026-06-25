from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    interval_start = Column(DateTime(timezone=True), index=True)
    interval_end = Column(DateTime(timezone=True))
    total_count = Column(Integer, default=0)
    average_density_score = Column(Float, default=0.0)
    environmental_risk_score = Column(Float, default=0.0)
    type_distribution_json = Column(Text, nullable=True) # Serialized dictionary of type counts


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    trigger_condition = Column(String, nullable=True)
    recommendation_text = Column(Text, nullable=False)
    urgency = Column(String, default="Low") # Low | Medium | High | Critical
    dismissed = Column(Boolean, default=False)


class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    horizon_days = Column(Integer, default=7) # 7 | 30 | 90
    predicted_counts_json = Column(Text, nullable=False) # JSON dict of dates and predicted counts
    confidence_intervals_json = Column(Text, nullable=True)


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    generated_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    report_type = Column(String, nullable=False) # PDF | CSV | Excel
    file_url = Column(String, nullable=False)
    metadata_json = Column(Text, nullable=True) # Extra info (filters used, etc.)
