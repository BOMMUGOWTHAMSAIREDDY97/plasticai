from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, database
from ..routers.auth import get_current_user
from typing import List, Dict, Any

router = APIRouter(prefix="/locations", tags=["Locations"])

@router.get("")
def get_locations(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    """
    Get all collection centers and recycling plants with statistics for the map.
    """
    centers = db.query(models.CollectionCenter).all()
    plants = db.query(models.RecyclingPlant).all()
    
    locations_list = []
    
    # Process Collection Centers
    for c in centers:
        locations_list.append({
            "id": f"center_{c.id}",
            "name": c.name,
            "type": "Collection Center",
            "latitude": c.latitude,
            "longitude": c.longitude,
            "district": c.district,
            "city": c.city,
            "state": c.state,
            "capacity": f"{c.capacity_kg:,.0f} kg",
            "color": "emerald"
        })
        
    # Process Recycling Plants
    for p in plants:
        locations_list.append({
            "id": f"plant_{p.id}",
            "name": p.name,
            "type": "Recycling Plant",
            "latitude": p.latitude,
            "longitude": p.longitude,
            "district": p.district,
            "city": p.city,
            "state": p.state,
            "capacity": f"{p.capacity_kg:,.0f} kg",
            "current_load": f"{p.current_load_kg:,.0f} kg",
            "efficiency": f"{p.efficiency_rate * 100:.1f}%",
            "color": "sky"
        })

    # If empty, return a default mock list for visual display
    if not locations_list:
        locations_list = [
            {
                "id": "center_1",
                "name": "Central District Collection Hub",
                "type": "Collection Center",
                "latitude": 17.385044,
                "longitude": 78.486671,
                "district": "Central District",
                "city": "Hyderabad",
                "capacity": "15,000 kg",
                "color": "emerald"
            },
            {
                "id": "center_2",
                "name": "North Valley Waste Depot",
                "type": "Collection Center",
                "latitude": 17.448293,
                "longitude": 78.391487,
                "district": "North District",
                "city": "Hyderabad",
                "capacity": "10,000 kg",
                "color": "emerald"
            },
            {
                "id": "plant_1",
                "name": "GreenLife Polymers Recycling Hub",
                "type": "Recycling Plant",
                "latitude": 17.3616,
                "longitude": 78.4747,
                "district": "South District",
                "city": "Hyderabad",
                "capacity": "25,000 kg",
                "current_load": "18,400 kg",
                "efficiency": "88.5%",
                "color": "sky"
            },
            {
                "id": "plant_2",
                "name": "EcoCycle Eco-Park Facility",
                "type": "Recycling Plant",
                "latitude": 17.4062,
                "longitude": 78.5306,
                "district": "East District",
                "city": "Hyderabad",
                "capacity": "20,000 kg",
                "current_load": "9,200 kg",
                "efficiency": "92.0%",
                "color": "sky"
            }
        ]
        
    return locations_list
