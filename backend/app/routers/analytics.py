from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from .. import models, database
from ..routers.auth import get_current_user
from sqlalchemy import func
from datetime import date, timedelta
from typing import List, Dict, Any, Optional
import hashlib

router = APIRouter(prefix="/analytics", tags=["Analytics"])

def get_seeded_val(seed_str: str, min_val: float, max_val: float) -> float:
    h = hashlib.md5(seed_str.encode('utf-8')).hexdigest()
    val = int(h[:8], 16)
    normalized = val / 0xffffffff
    return round(min_val + normalized * (max_val - min_val), 1)

def get_mock_trends(range_val: str, state: Optional[str], district: Optional[str], city: Optional[str], category: Optional[str]):
    seed = f"{state or 'India'}_{district or ''}_{city or ''}_{category or ''}"
    
    if range_val == "daily":
        today = date.today()
        labels = [str(today - timedelta(days=i)) for i in range(6, -1, -1)]
        count = 7
    else:
        labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        count = 12
        
    collected_data = []
    recycled_data = []
    landfill_data = []
    wte_data = []
    
    for i in range(count):
        step_seed = f"{seed}_{i}"
        
        base = get_seeded_val(step_seed + "_coll", 12000.0, 25000.0)
        if district:
            base = base * 0.15
        if category:
            base = base * 0.25
            
        coll = round(base, 1)
        
        rec_ratio = get_seeded_val(step_seed + "_rec", 0.60, 0.70)
        landfill_ratio = get_seeded_val(step_seed + "_land", 0.10, 0.15)
        wte_ratio = get_seeded_val(step_seed + "_wte", 0.15, 0.20)
        
        collected_data.append(coll)
        recycled_data.append(round(coll * rec_ratio, 1))
        landfill_data.append(round(coll * landfill_ratio, 1))
        wte_data.append(round(coll * wte_ratio, 1))
        
    return {
        "labels": labels,
        "datasets": {
            "collected": collected_data,
            "recycled": recycled_data,
            "landfill": landfill_data,
            "wte": wte_data
        }
    }

@router.get("/trends")
def get_analytics_trends(
    range: str = "daily", # daily, weekly, monthly, yearly
    district: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get trend datasets for historical charts, filtered by district, city, state, and category.
    """
    if state:
        state_exists = db.query(models.CollectionCenter).filter(models.CollectionCenter.state == state).first()
        if not state_exists:
            return get_mock_trends(range, state, district, city, category)

    # Base query for collections
    collection_query = db.query(
        models.WasteCollectionLog.log_date,
        func.sum(models.WasteCollectionLog.quantity_kg).label("total")
    ).join(models.CollectionCenter)
    
    # Base query for processings
    processing_query = db.query(
        models.WasteProcessingLog.log_date,
        func.sum(models.WasteProcessingLog.sent_to_recycling_kg).label("recycled"),
        func.sum(models.WasteProcessingLog.sent_to_landfill_kg).label("landfill"),
        func.sum(models.WasteProcessingLog.sent_to_wte_kg).label("wte"),
        func.sum(models.WasteProcessingLog.total_processed_kg).label("processed")
    ).join(models.CollectionCenter)

    # Apply filters
    if state:
        collection_query = collection_query.filter(models.CollectionCenter.state == state)
        processing_query = processing_query.filter(models.CollectionCenter.state == state)
    if district:
        collection_query = collection_query.filter(models.CollectionCenter.district == district)
        processing_query = processing_query.filter(models.CollectionCenter.district == district)
    if city:
        collection_query = collection_query.filter(models.CollectionCenter.city == city)
        processing_query = processing_query.filter(models.CollectionCenter.city == city)
    if category:
        collection_query = collection_query.filter(models.WasteCollectionLog.waste_category == category)
        # Note: processing logs are not split by category, so we approximate category ratios if needed

    # Apply date limits based on range
    today = date.today()
    if range == "daily":
        start_date = today - timedelta(days=7)
        collection_query = collection_query.filter(models.WasteCollectionLog.log_date >= start_date)
        processing_query = processing_query.filter(models.WasteProcessingLog.log_date >= start_date)
        
        # Group by date
        collections = collection_query.group_by(models.WasteCollectionLog.log_date).order_by(models.WasteCollectionLog.log_date).all()
        processings = processing_query.group_by(models.WasteProcessingLog.log_date).order_by(models.WasteProcessingLog.log_date).all()
        
        labels = [str(c[0]) for c in collections]
        collected_data = [float(c[1]) for c in collections]
        recycled_data = [float(p[1]) for p in processings]
        landfill_data = [float(p[2]) for p in processings]
        wte_data = [float(p[3]) for p in processings]
    else:
        # Default fallback/mock trend data if no db logs yet, or to simplify dashboard view
        labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        collected_data = [12400, 14200, 15800, 16100, 17500, 18900, 20100, 19400, 21200, 22400, 23800, 25000]
        recycled_data = [7800, 8900, 9900, 10200, 11200, 12100, 13000, 12400, 13800, 14500, 15600, 16200]
        landfill_data = [1500, 1800, 2000, 1900, 2100, 2300, 2500, 2200, 2400, 2600, 2800, 3000]
        wte_data = [3100, 3500, 3900, 4000, 4200, 4500, 4600, 4800, 5000, 5300, 5400, 5800]

        # Use actual values if database is seeded
        db_has_logs = db.query(models.WasteCollectionLog).count() > 0
        if db_has_logs:
            # Overwrite with aggregated database metrics
            agg_coll = collection_query.group_by(models.WasteCollectionLog.log_date).all()
            agg_proc = processing_query.group_by(models.WasteProcessingLog.log_date).all()
            if agg_coll:
                labels = [str(x[0].strftime("%b %d")) for x in agg_coll][-10:]
                collected_data = [float(x[1]) for x in agg_coll][-10:]
                recycled_data = [float(x[1]) for x in agg_proc][-10:]
                landfill_data = [float(x[2]) for x in agg_proc][-10:]
                wte_data = [float(x[3]) for x in agg_proc][-10:]

    return {
        "labels": labels,
        "datasets": {
            "collected": collected_data,
            "recycled": recycled_data,
            "landfill": landfill_data,
            "wte": wte_data
        }
    }

@router.get("/recycling")
def get_recycling_analytics(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get deep recycling metrics: estimated revenues, purity rates, carbon offset, and diversion.
    """
    total_processed = db.query(func.sum(models.WasteProcessingLog.total_processed_kg)).scalar() or 0.0
    total_recycled = db.query(func.sum(models.WasteProcessingLog.sent_to_recycling_kg)).scalar() or 0.0
    total_landfill = db.query(func.sum(models.WasteProcessingLog.sent_to_landfill_kg)).scalar() or 0.0
    total_rejected = db.query(func.sum(models.WasteProcessingLog.rejected_kg)).scalar() or 0.0
    
    avg_purity = db.query(func.avg(models.WasteProcessingLog.purity_rate)).scalar() or 0.0
    
    # Seeding demo constants if empty
    if total_processed == 0.0:
        total_processed = 115950.0
        total_recycled = 78450.0
        total_landfill = 15200.0
        total_rejected = 9480.0
        avg_purity = 0.915

    recycling_rate = (total_recycled / total_processed * 100) if total_processed > 0 else 0.0
    recovery_rate = ((total_recycled + (total_processed - total_recycled - total_landfill - total_rejected)) / total_processed * 100) if total_processed > 0 else 0.0
    
    # Financial estimates: $0.65/kg of recycled plastic
    estimated_revenue = total_recycled * 0.65
    # Carbon offset estimates: 1.5kg CO2 saved per kg of recycled plastic
    carbon_emissions_saved_kg = total_recycled * 1.5

    return {
        "total_recycled_kg": total_recycled,
        "recycling_rate": round(recycling_rate, 1),
        "recovery_rate": round(recovery_rate, 1),
        "rejected_material_kg": total_rejected,
        "material_purity": round(avg_purity * 100, 1),
        "estimated_revenue_usd": round(estimated_revenue, 2),
        "carbon_emissions_saved_kg": round(carbon_emissions_saved_kg, 1)
    }
