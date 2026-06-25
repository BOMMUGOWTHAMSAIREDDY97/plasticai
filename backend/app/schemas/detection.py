from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# Plastic Type
class PlasticTypeBase(BaseModel):
    name: str
    default_risk_weight: Optional[float] = 1.0
    recycling_code: Optional[str] = None

class PlasticTypeCreate(PlasticTypeBase):
    pass

class PlasticTypeOut(PlasticTypeBase):
    id: int

    class Config:
        from_attributes = True

# Detection
class DetectionBase(BaseModel):
    plastic_type_id: int
    confidence: float
    bounding_box_x: float
    bounding_box_y: float
    bounding_box_w: float
    bounding_box_h: float
    location_label: Optional[str] = "Webcam Feed"

class DetectionCreate(DetectionBase):
    user_id: Optional[int] = None

class DetectionOut(DetectionBase):
    id: int
    user_id: Optional[int]
    timestamp: datetime
    plastic_type: PlasticTypeOut

    class Config:
        from_attributes = True

# Tracking Event
class TrackingEventBase(BaseModel):
    detection_id: int
    tracking_id: str
    trajectory_data_json: Optional[str] = None
    duration_start: Optional[datetime] = None
    duration_end: Optional[datetime] = None

class TrackingEventCreate(TrackingEventBase):
    pass

class TrackingEventOut(TrackingEventBase):
    id: int

    class Config:
        from_attributes = True
