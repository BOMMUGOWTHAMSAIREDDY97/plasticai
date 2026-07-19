import os
import sys
import random
from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models

def seed_data():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Check if centers exist, if so, we can clear them or just add new ones if empty
        if db.query(models.CollectionCenter).count() > 0:
            print("Data already exists. Please clear the database first or adjust the script.")
            # For this request, let's delete existing to start fresh
            db.query(models.WasteProcessingLog).delete()
            db.query(models.WasteCollectionLog).delete()
            db.query(models.CollectionCenter).delete()
            db.query(models.RecyclingPlant).delete()
            db.commit()
            print("Cleared existing data.")

        print("Seeding Collection Centers...")
        centers = [
            models.CollectionCenter(name="Hyderabad Central Hub", district="Hyderabad", city="Hyderabad", state="Telangana", latitude=17.3850, longitude=78.4867, capacity_kg=50000.0),
            models.CollectionCenter(name="Vizag Coastal Facility", district="Visakhapatnam", city="Visakhapatnam", state="Andhra Pradesh", latitude=17.6868, longitude=83.2185, capacity_kg=75000.0),
            models.CollectionCenter(name="Vijayawada Sorting Station", district="NTR", city="Vijayawada", state="Andhra Pradesh", latitude=16.5062, longitude=80.6480, capacity_kg=40000.0),
            models.CollectionCenter(name="Cyberabad Tech Hub", district="Ranga Reddy", city="Hyderabad", state="Telangana", latitude=17.4483, longitude=78.3915, capacity_kg=60000.0),
            models.CollectionCenter(name="Guntur Waste Depot", district="Guntur", city="Guntur", state="Andhra Pradesh", latitude=16.3067, longitude=80.4365, capacity_kg=35000.0)
        ]
        db.add_all(centers)
        db.commit()

        print("Seeding Recycling Plants...")
        plants = [
            models.RecyclingPlant(name="Deccan Polymer Recyclers", district="Medchal-Malkajgiri", city="Hyderabad", state="Telangana", latitude=17.5111, longitude=78.5361, capacity_kg=100000.0),
            models.RecyclingPlant(name="Andhra Eco-Plast Solutions", district="Anakapalli", city="Visakhapatnam", state="Andhra Pradesh", latitude=17.6914, longitude=83.0039, capacity_kg=120000.0)
        ]
        db.add_all(plants)
        db.commit()

        print("Seeding Logs...")
        today = date.today()
        categories = ["PET", "HDPE", "LDPE", "PP", "Other"]
        
        centers_db = db.query(models.CollectionCenter).all()
        
        # Generate 60 days of historical data
        for i in range(60):
            current_date = today - timedelta(days=60 - i)
            
            for center in centers_db:
                # Collection Logs
                for category in categories:
                    # Randomize collected quantities based on category and center capacity
                    base_qty = (center.capacity_kg / 30) * random.uniform(0.1, 0.4)
                    if category == "PET": base_qty *= 1.5
                    
                    c_log = models.WasteCollectionLog(
                        center_id=center.id,
                        quantity_kg=round(base_qty, 1),
                        waste_category=category,
                        log_date=current_date
                    )
                    db.add(c_log)
                
                # Processing Logs
                # Assuming they process about 80-90% of daily collected waste
                daily_collected_est = (center.capacity_kg / 30) * random.uniform(0.5, 1.2)
                processed = round(daily_collected_est * random.uniform(0.8, 1.0), 1)
                
                recycling = round(processed * random.uniform(0.55, 0.75), 1)
                rejected = round(processed * random.uniform(0.05, 0.15), 1)
                landfill = round(processed * random.uniform(0.05, 0.20), 1)
                wte = processed - recycling - rejected - landfill
                if wte < 0: wte = 0.0
                
                p_log = models.WasteProcessingLog(
                    center_id=center.id,
                    total_processed_kg=processed,
                    sent_to_recycling_kg=recycling,
                    sent_to_landfill_kg=landfill,
                    sent_to_wte_kg=round(wte, 1),
                    rejected_kg=rejected,
                    purity_rate=round(random.uniform(0.7, 0.95), 2),
                    log_date=current_date
                )
                db.add(p_log)
        
        db.commit()
        print("Data seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
