from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date

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

# New schemas for enterprise waste management

class CollectionCenterBase(BaseModel):
    name: str
    district: str
    city: str
    state: str = "Telangana"
    capacity_kg: float
    latitude: float
    longitude: float

class CollectionCenterCreate(CollectionCenterBase):
    pass

class CollectionCenter(CollectionCenterBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class RecyclingPlantBase(BaseModel):
    name: str
    district: str
    city: str
    state: str = "Telangana"
    capacity_kg: float
    current_load_kg: float
    efficiency_rate: float
    latitude: float
    longitude: float

class RecyclingPlantCreate(RecyclingPlantBase):
    pass

class RecyclingPlant(RecyclingPlantBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class WasteCollectionLogBase(BaseModel):
    center_id: int
    quantity_kg: float
    waste_category: str
    log_date: date

class WasteCollectionLogCreate(WasteCollectionLogBase):
    pass

class WasteCollectionLog(WasteCollectionLogBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class WasteProcessingLogBase(BaseModel):
    center_id: int
    total_processed_kg: float
    sent_to_recycling_kg: float
    sent_to_landfill_kg: float
    sent_to_wte_kg: float
    rejected_kg: float
    purity_rate: float
    log_date: date

class WasteProcessingLogCreate(WasteProcessingLogBase):
    pass

class WasteProcessingLog(WasteProcessingLogBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ReportOut(BaseModel):
    id: int
    title: str
    report_type: str
    generated_at: datetime
    generated_by_id: int
    file_path: Optional[str] = None

    class Config:
        from_attributes = True

class DashboardSummaryOut(BaseModel):
    total_collected_kg: float
    processed_today_kg: float
    sent_to_recycling_kg: float
    sent_to_landfill_kg: float
    sent_to_wte_kg: float
    awaiting_processing_kg: float

class WasteFlowLink(BaseModel):
    source: str
    target: str
    value: float

class WasteFlowOut(BaseModel):
    links: List[WasteFlowLink]

class ScanReportCreate(BaseModel):
    image_base64: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ScanReportOut(BaseModel):
    id: int
    user_id: int
    image_url: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = None
    plastic_percentage: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

