from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "operator"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class RoleUpdate(BaseModel):
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class DetectionBase(BaseModel):
    plastic_type_id: int
    confidence: float
    location_x: float
    location_y: float
    session_id: str

class DetectionCreate(DetectionBase):
    pass

class Detection(DetectionBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class AnalyticsData(BaseModel):
    total_detections: int
    environmental_risk_score: float
    plastic_density: float
    date: datetime

    class Config:
        from_attributes = True

class ScanReportCreate(BaseModel):
    image_base64: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ScanReportOut(BaseModel):
    id: int
    user_id: int
    image_url: str
    latitude: Optional[float]
    longitude: Optional[float]
    location_name: Optional[str]
    plastic_percentage: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
