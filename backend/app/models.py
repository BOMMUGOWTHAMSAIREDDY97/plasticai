from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    role = Column(String, default="operator")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PlasticType(Base):
    __tablename__ = "plastic_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True) # e.g., "PET Bottle", "Plastic Bag"
    risk_level = Column(String) # Low, Medium, High, Critical
    recyclability_score = Column(Float)

class Detection(Base):
    __tablename__ = "detections"
    
    id = Column(Integer, primary_key=True, index=True)
    plastic_type_id = Column(Integer, ForeignKey("plastic_types.id"))
    confidence = Column(Float)
    location_x = Column(Float)
    location_y = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    session_id = Column(String, index=True)
    
    plastic_type = relationship("PlasticType")

class Analytics(Base):
    __tablename__ = "analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime(timezone=True), server_default=func.now())
    total_detections = Column(Integer, default=0)
    environmental_risk_score = Column(Float, default=0.0)
    plastic_density = Column(Float, default=0.0)
