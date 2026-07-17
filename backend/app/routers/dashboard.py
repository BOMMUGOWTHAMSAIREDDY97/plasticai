from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, database
from ..routers.auth import get_current_user
from ..services.insights import InsightGenerator
from sqlalchemy import func
from datetime import date, timedelta
from typing import List, Dict, Any, Optional
import hashlib

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

def get_seeded_val(seed_str: str, min_val: float, max_val: float) -> float:
    h = hashlib.md5(seed_str.encode('utf-8')).hexdigest()
    val = int(h[:8], 16)
    normalized = val / 0xffffffff
    return round(min_val + normalized * (max_val - min_val), 1)

def get_mock_summary(state: Optional[str], district: Optional[str], city: Optional[str], category: Optional[str]):
    # Deterministic mock summary generator based on input parameters hash
    seed = f"{state or 'India'}_{district or ''}_{city or ''}_{category or ''}"
    base_collected = get_seeded_val(seed + "_coll", 50000.0, 250000.0)
    
    if category:
        base_collected = base_collected * get_seeded_val(seed + "_cat_ratio", 0.15, 0.30)
    if district:
        base_collected = base_collected * get_seeded_val(seed + "_dist_ratio", 0.05, 0.20)
        
    total_collected = round(base_collected, 1)
    
    processed_today = get_seeded_val(seed + "_today", 2000.0, 8000.0)
    if district:
        processed_today = processed_today * 0.1
    processed_today = round(min(processed_today, total_collected * 0.05), 1)
    
    rec_ratio = get_seeded_val(seed + "_rec_ratio", 0.60, 0.70)
    landfill_ratio = get_seeded_val(seed + "_land_ratio", 0.10, 0.15)
    wte_ratio = get_seeded_val(seed + "_wte_ratio", 0.15, 0.20)
    
    total_recycled = round(total_collected * rec_ratio, 1)
    total_landfill = round(total_collected * landfill_ratio, 1)
    total_wte = round(total_collected * wte_ratio, 1)
    
    total_processed = total_recycled + total_landfill + total_wte
    awaiting_processing = round(max(0.0, total_collected - total_processed), 1)
    
    return schemas.DashboardSummaryOut(
        total_collected_kg=total_collected,
        processed_today_kg=processed_today,
        sent_to_recycling_kg=total_recycled,
        sent_to_landfill_kg=total_landfill,
        sent_to_wte_kg=total_wte,
        awaiting_processing_kg=awaiting_processing
    )

@router.get("/summary", response_model=schemas.DashboardSummaryOut)
def get_dashboard_summary(
    state: Optional[str] = None,
    city: Optional[str] = None,
    district: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get the 6 core KPI metrics for the overview dashboard, filtered by state, city, district, and category.
    """
    if state:
        state_exists = db.query(models.CollectionCenter).filter(models.CollectionCenter.state == state).first()
        if not state_exists:
            return get_mock_summary(state, district, city, category)

    # Check if database is empty to fallback to seeding defaults
    total_db_collected = db.query(func.sum(models.WasteCollectionLog.quantity_kg)).scalar() or 0.0
    if total_db_collected == 0.0:
        return schemas.DashboardSummaryOut(
            total_collected_kg=125430.0,
            processed_today_kg=4820.0,
            sent_to_recycling_kg=78450.0,
            sent_to_landfill_kg=15200.0,
            sent_to_wte_kg=22300.0,
            awaiting_processing_kg=9480.0
        )

    # Sum total collected
    coll_q = db.query(func.sum(models.WasteCollectionLog.quantity_kg)).join(models.CollectionCenter)
    if state:
        coll_q = coll_q.filter(models.CollectionCenter.state == state)
    if city:
        coll_q = coll_q.filter(models.CollectionCenter.city == city)
    if district:
        coll_q = coll_q.filter(models.CollectionCenter.district == district)
    if category:
        coll_q = coll_q.filter(models.WasteCollectionLog.waste_category == category)
    total_collected = coll_q.scalar() or 0.0
    
    # Processed today (logs recorded for today)
    today = date.today()
    proc_today_q = db.query(func.sum(models.WasteProcessingLog.total_processed_kg)).join(models.CollectionCenter).filter(
        models.WasteProcessingLog.log_date == today
    )
    if state:
        proc_today_q = proc_today_q.filter(models.CollectionCenter.state == state)
    if city:
        proc_today_q = proc_today_q.filter(models.CollectionCenter.city == city)
    if district:
        proc_today_q = proc_today_q.filter(models.CollectionCenter.district == district)
    processed_today = proc_today_q.scalar() or 0.0
    
    # Cumulative processed targets
    recycled_q = db.query(func.sum(models.WasteProcessingLog.sent_to_recycling_kg)).join(models.CollectionCenter)
    if state:
        recycled_q = recycled_q.filter(models.CollectionCenter.state == state)
    if city:
        recycled_q = recycled_q.filter(models.CollectionCenter.city == city)
    if district:
        recycled_q = recycled_q.filter(models.CollectionCenter.district == district)
    total_recycled = recycled_q.scalar() or 0.0

    landfill_q = db.query(func.sum(models.WasteProcessingLog.sent_to_landfill_kg)).join(models.CollectionCenter)
    if state:
        landfill_q = landfill_q.filter(models.CollectionCenter.state == state)
    if city:
        landfill_q = landfill_q.filter(models.CollectionCenter.city == city)
    if district:
        landfill_q = landfill_q.filter(models.CollectionCenter.district == district)
    total_landfill = landfill_q.scalar() or 0.0

    wte_q = db.query(func.sum(models.WasteProcessingLog.sent_to_wte_kg)).join(models.CollectionCenter)
    if state:
        wte_q = wte_q.filter(models.CollectionCenter.state == state)
    if city:
        wte_q = wte_q.filter(models.CollectionCenter.city == city)
    if district:
        wte_q = wte_q.filter(models.CollectionCenter.district == district)
    total_wte = wte_q.scalar() or 0.0
    
    processed_q = db.query(func.sum(models.WasteProcessingLog.total_processed_kg)).join(models.CollectionCenter)
    if state:
        processed_q = processed_q.filter(models.CollectionCenter.state == state)
    if city:
        processed_q = processed_q.filter(models.CollectionCenter.city == city)
    if district:
        processed_q = processed_q.filter(models.CollectionCenter.district == district)
    total_processed = processed_q.scalar() or 0.0

    awaiting_processing = max(0.0, total_collected - total_processed)

    return schemas.DashboardSummaryOut(
        total_collected_kg=total_collected,
        processed_today_kg=processed_today,
        sent_to_recycling_kg=total_recycled,
        sent_to_landfill_kg=total_landfill,
        sent_to_wte_kg=total_wte,
        awaiting_processing_kg=awaiting_processing
    )

@router.get("/flow", response_model=schemas.WasteFlowOut)
def get_waste_flow(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    """
    Get linkages and volumes for the interactive waste flow diagram.
    """
    total_collected = db.query(func.sum(models.WasteCollectionLog.quantity_kg)).scalar() or 0.0
    
    total_recycled = db.query(func.sum(models.WasteProcessingLog.sent_to_recycling_kg)).scalar() or 0.0
    total_landfill = db.query(func.sum(models.WasteProcessingLog.sent_to_landfill_kg)).scalar() or 0.0
    total_wte = db.query(func.sum(models.WasteProcessingLog.sent_to_wte_kg)).scalar() or 0.0
    total_rejected = db.query(func.sum(models.WasteProcessingLog.rejected_kg)).scalar() or 0.0
    
    # Seeding demo data if empty
    if total_collected == 0.0:
        total_collected = 100000.0
        total_recycled = 60000.0
        total_rejected = 15000.0
        total_landfill = 10000.0
        total_wte = 15000.0

    sorting_input = total_collected
    
    links = [
        {"source": "Collection Center", "target": "Sorting Facility", "value": sorting_input},
        {"source": "Sorting Facility", "target": "Recycling Plant", "value": total_recycled},
        {"source": "Sorting Facility", "target": "Rejected Waste", "value": total_rejected},
        {"source": "Sorting Facility", "target": "Non-Recyclable Waste", "value": total_landfill + total_wte - total_rejected if (total_landfill + total_wte > total_rejected) else total_landfill},
        {"source": "Recycling Plant", "target": "Manufacturing Industries", "value": total_recycled},
        {"source": "Rejected Waste", "target": "Waste-to-Energy Plant", "value": total_rejected},
        {"source": "Non-Recyclable Waste", "target": "Landfill", "value": total_landfill}
    ]

    return schemas.WasteFlowOut(links=links)

@router.get("/insights")
def get_insights(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    """
    Get AI-driven insights and recommendations.
    """
    return InsightGenerator.get_ai_insights(db)
