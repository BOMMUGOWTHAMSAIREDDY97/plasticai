from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, database
from ..routers.auth import get_current_user
from datetime import date, timedelta
import random

router = APIRouter(prefix="/admin", tags=["Administration"])

@router.get("/stats")
def get_admin_stats(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    """
    Get simple statistics on the database entities.
    """
    if current_user.role != "admin" and current_user.role != "operator":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    return {
        "collection_centers": db.query(models.CollectionCenter).count(),
        "recycling_plants": db.query(models.RecyclingPlant).count(),
        "collection_logs": db.query(models.WasteCollectionLog).count(),
        "processing_logs": db.query(models.WasteProcessingLog).count(),
        "users": db.query(models.User).count()
    }

@router.post("/seed")
def seed_database(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    """
    Seeding route to populate the database with complete, rich mock data for dashboards.
    """
    if current_user.role != "admin" and current_user.role != "operator":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Clear previous logs if they exist
    db.query(models.WasteCollectionLog).delete()
    db.query(models.WasteProcessingLog).delete()
    db.query(models.CollectionCenter).delete()
    db.query(models.RecyclingPlant).delete()
    db.commit()

    # Mappings of all 36 States and UTs to a major district/city and coordinates
    state_centers = {
        "Andaman and Nicobar Islands": ("South Andaman", "Port Blair", 11.6234, 92.7265),
        "Andhra Pradesh": ("Visakhapatnam", "Visakhapatnam", 17.6868, 83.2185),
        "Arunachal Pradesh": ("Papum Pare", "Itanagar", 27.0844, 93.6053),
        "Assam": ("Kamrup Metropolitan", "Guwahati", 26.1445, 91.7362),
        "Bihar": ("Patna", "Patna", 25.5941, 85.1376),
        "Chandigarh": ("Chandigarh", "Chandigarh", 30.7333, 76.7794),
        "Chhattisgarh": ("Raipur", "Raipur", 21.2514, 81.6296),
        "Dadra and Nagar Haveli and Daman and Diu": ("Daman", "Daman", 20.3974, 72.8328),
        "Delhi": ("New Delhi", "New Delhi", 28.6139, 77.2090),
        "Goa": ("North Goa", "Panaji", 15.4909, 73.8278),
        "Gujarat": ("Ahmedabad", "Ahmedabad", 23.0225, 72.5714),
        "Haryana": ("Gurugram", "Gurugram", 28.4595, 77.0266),
        "Himachal Pradesh": ("Shimla", "Shimla", 31.1048, 77.1734),
        "Jammu and Kashmir": ("Srinagar", "Srinagar", 34.0837, 74.7973),
        "Jharkhand": ("Ranchi", "Ranchi", 23.3441, 85.3096),
        "Karnataka": ("Bengaluru Urban", "Bengaluru", 12.9716, 77.5946),
        "Kerala": ("Thiruvananthapuram", "Thiruvananthapuram", 8.5241, 76.9366),
        "Ladakh": ("Leh", "Leh", 34.1526, 77.5771),
        "Lakshadweep": ("Kavaratti", "Kavaratti", 10.5667, 72.6370),
        "Madhya Pradesh": ("Bhopal", "Bhopal", 23.2599, 77.4126),
        "Maharashtra": ("Mumbai City", "Mumbai", 19.0760, 72.8777),
        "Manipur": ("Imphal West", "Imphal", 24.8170, 93.9368),
        "Meghalaya": ("East Khasi Hills", "Shillong", 25.5788, 91.8931),
        "Mizoram": ("Aizawl", "Aizawl", 23.7271, 92.7176),
        "Nagaland": ("Kohima", "Kohima", 25.6751, 94.1086),
        "Odisha": ("Khurda", "Bhubaneswar", 20.2961, 85.8245),
        "Puducherry": ("Puducherry", "Puducherry", 11.9416, 79.8083),
        "Punjab": ("Ludhiana", "Ludhiana", 30.9010, 75.8573),
        "Rajasthan": ("Jaipur", "Jaipur", 26.9124, 75.7873),
        "Sikkim": ("Gangtok", "Gangtok", 27.3314, 88.6138),
        "Tamil Nadu": ("Chennai District", "Chennai", 13.0827, 80.2707),
        "Telangana": ("Hyderabad", "Hyderabad", 17.3850, 78.4866),
        "Tripura": ("West Tripura", "Agartala", 23.8315, 91.2868),
        "Uttar Pradesh": ("Lucknow", "Lucknow", 26.8467, 80.9462),
        "Uttarakhand": ("Dehradun", "Dehradun", 30.3165, 78.0322),
        "West Bengal": ("Kolkata", "Kolkata", 22.5726, 88.3639)
    }

    centers = []
    # 1. Create 1 Collection Center for each State/UT
    for state, details in state_centers.items():
        district, city, lat, lon = details
        c_info = {
            "name": f"{city} Eco-Recovery Depot",
            "district": district,
            "city": city,
            "state": state,
            "capacity_kg": 15000.0,
            "latitude": lat,
            "longitude": lon
        }
        center = models.CollectionCenter(**c_info)
        db.add(center)
        centers.append(center)

    # 2. Create 1 Recycling Plant for each State/UT
    for state, details in state_centers.items():
        district, city, lat, lon = details
        p_info = {
            "name": f"{city} Green Polymers Recycling Plant",
            "district": district,
            "city": city,
            "state": state,
            "capacity_kg": 20000.0,
            "current_load_kg": round(random.uniform(5000.0, 15000.0), 1),
            "efficiency_rate": round(random.uniform(0.85, 0.95), 2),
            "latitude": lat + 0.05, # Offset slightly
            "longitude": lon + 0.05
        }
        plant = models.RecyclingPlant(**p_info)
        db.add(plant)

    db.commit()

    # Refresh centers to obtain IDs
    for c in centers:
        db.refresh(c)

    # 3. Create daily logs for the past 30 days
    categories = ["PET", "HDPE", "LDPE", "PP", "Other"]
    today = date.today()

    for i in range(30):
        log_date = today - timedelta(days=i)
        for center in centers:
            total_day_collected = 0.0
            # Create collection log for each category
            for cat in categories:
                # Random collection amount between 150kg and 800kg per category
                qty = round(random.uniform(150.0, 800.0), 1)
                total_day_collected += qty
                coll_log = models.WasteCollectionLog(
                    center_id=center.id,
                    quantity_kg=qty,
                    waste_category=cat,
                    log_date=log_date
                )
                db.add(coll_log)

            # Processing log for this day (~85-95% processed)
            total_processed = total_day_collected * random.uniform(0.85, 0.95)
            recycled = total_processed * random.uniform(0.60, 0.75)
            landfill = total_processed * random.uniform(0.08, 0.15)
            wte = total_processed * random.uniform(0.12, 0.20)
            rejected = total_processed - (recycled + landfill + wte)
            if rejected < 0:
                rejected = 0.0
            purity = random.uniform(0.88, 0.96)

            proc_log = models.WasteProcessingLog(
                center_id=center.id,
                total_processed_kg=round(total_processed, 1),
                sent_to_recycling_kg=round(recycled, 1),
                sent_to_landfill_kg=round(landfill, 1),
                sent_to_wte_kg=round(wte, 1),
                rejected_kg=round(rejected, 1),
                purity_rate=round(purity, 3),
                log_date=log_date
            )
            db.add(proc_log)

    db.commit()
    return {"message": "Database seeded successfully with 30 days of metrics across all 36 states and Union Territories."}

