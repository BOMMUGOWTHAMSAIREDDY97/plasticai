from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class PlasticType(Base):
    __tablename__ = "plastic_types"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True, index=True, nullable=False) # e.g. Plastic Bottle, Plastic Bag
    default_risk_weight = Column(Float, default=1.0)
    recycling_code = Column(String, nullable=True)

    detections = relationship("Detection", back_populates="plastic_type")


class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    plastic_type_id = Column(Integer, ForeignKey("plastic_types.id"), nullable=False)
    confidence = Column(Float, nullable=False)
    
    # Bounding box coordinates (normalized 0.0 to 1.0 or pixel coordinates)
    bounding_box_x = Column(Float, nullable=False)
    bounding_box_y = Column(Float, nullable=False)
    bounding_box_w = Column(Float, nullable=False)
    bounding_box_h = Column(Float, nullable=False)
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    location_label = Column(String, default="Webcam Feed")

    # Relationships
    plastic_type = relationship("PlasticType", back_populates="detections")
    tracking_events = relationship("TrackingEvent", back_populates="detection")


class TrackingEvent(Base):
    __tablename__ = "tracking_events"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    detection_id = Column(Integer, ForeignKey("detections.id"), nullable=False)
    tracking_id = Column(String, nullable=False, index=True)  # e.g., "Bottle #1"
    trajectory_data_json = Column(Text, nullable=True)  # Serialized list of coordinates
    duration_start = Column(DateTime(timezone=True), server_default=func.now())
    duration_end = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    detection = relationship("Detection", back_populates="tracking_events")
