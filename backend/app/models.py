from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    role = Column(String, default="operator") # admin, operator, viewer
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CollectionCenter(Base):
    __tablename__ = "collection_centers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    district = Column(String, index=True)
    city = Column(String, index=True)
    state = Column(String, index=True, default="Telangana")
    capacity_kg = Column(Float, default=10000.0)
    latitude = Column(Float)
    longitude = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class RecyclingPlant(Base):
    __tablename__ = "recycling_plants"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    district = Column(String, index=True)
    city = Column(String, index=True)
    state = Column(String, index=True, default="Telangana")
    capacity_kg = Column(Float, default=20000.0)
    current_load_kg = Column(Float, default=0.0)
    efficiency_rate = Column(Float, default=0.85) # percentage processed successfully
    latitude = Column(Float)
    longitude = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class WasteCollectionLog(Base):
    __tablename__ = "waste_collection_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    center_id = Column(Integer, ForeignKey("collection_centers.id"))
    quantity_kg = Column(Float, nullable=False)
    waste_category = Column(String, nullable=False) # e.g., PET, HDPE, LDPE, PP, Other
    log_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    center = relationship("CollectionCenter")

class WasteProcessingLog(Base):
    __tablename__ = "waste_processing_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    center_id = Column(Integer, ForeignKey("collection_centers.id"))
    total_processed_kg = Column(Float, nullable=False)
    sent_to_recycling_kg = Column(Float, default=0.0)
    sent_to_landfill_kg = Column(Float, default=0.0)
    sent_to_wte_kg = Column(Float, default=0.0)
    rejected_kg = Column(Float, default=0.0)
    purity_rate = Column(Float, default=1.0) # 0.0 to 1.0
    log_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    center = relationship("CollectionCenter")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    report_type = Column(String, default="Executive") # Executive, Monthly, Annual
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    generated_by_id = Column(Integer, ForeignKey("users.id"))
    file_path = Column(String, nullable=True)
    
    generated_by = relationship("User")

class ScanReport(Base):
    __tablename__ = "scan_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    image_url = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location_name = Column(String, nullable=True)
    plastic_percentage = Column(Float, default=0.0)
    status = Column(String, default="processed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User")

