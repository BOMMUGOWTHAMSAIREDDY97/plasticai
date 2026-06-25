from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database
from .auth import get_current_user

router = APIRouter(prefix="/detections", tags=["Detections"])

@router.post("/", response_model=schemas.Detection)
def create_detection(detection: schemas.DetectionCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    db_detection = models.Detection(**detection.dict())
    db.add(db_detection)
    db.commit()
    db.refresh(db_detection)
    
    # Update analytics here ideally or via background task
    return db_detection

@router.get("/", response_model=List[schemas.Detection])
def get_detections(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    detections = db.query(models.Detection).offset(skip).limit(limit).all()
    return detections
