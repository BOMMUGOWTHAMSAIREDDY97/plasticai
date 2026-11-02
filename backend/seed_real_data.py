import json
import random
from datetime import date, timedelta
import reverse_geocoder as rg
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models

def seed_real_data():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # We will delete existing data to replace it with real data
        db.query(models.WasteProcessingLog).delete()
        db.query(models.WasteCollectionLog).delete()
        db.query(models.CollectionCenter).delete()
        db.query(models.RecyclingPlant).delete()
        db.commit()
        print("Cleared existing data.")

        import os
        base_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_dir, "overpass_results.json")
        with open(file_path, "r", encoding="utf-8") as f:
            elements = json.load(f)
            
        print(f"Loaded {len(elements)} real locations.")
        
        # Prepare coordinates for reverse geocoding
        coords = [(el.get('lat', el.get('center', {}).get('lat')), el.get('lon', el.get('center', {}).get('lon'))) for el in elements if 'lat' in el or 'center' in el]
        elements_with_coords = [el for el in elements if 'lat' in el or 'center' in el]
        
        print("Reverse geocoding locations to find city and state...")
        results = rg.search(coords)
        
        centers = []
        plants = []
        
        for i, el in enumerate(elements_with_coords):
            lat = el.get('lat', el.get('center', {}).get('lat'))
            lon = el.get('lon', el.get('center', {}).get('lon'))
            tags = el.get('tags', {})
            name = tags.get('name')
            if not name:
                name = f"Recycling Facility {el['id']}"
            else:
                name = f"{name} (ID: {el['id']})"
                
            rg_res = results[i]
            city = rg_res.get('name', 'Unknown City')
            district = rg_res.get('admin2', city)
            state = rg_res.get('admin1', 'Unknown State')
            
            # Randomly distribute between CollectionCenters (80%) and RecyclingPlants (20%)
            if random.random() < 0.2:
                plants.append(models.RecyclingPlant(
                    name=name, district=district, city=city, state=state, 
                    latitude=lat, longitude=lon, 
                    capacity_kg=round(random.uniform(50000, 150000), 2)
                ))
            else:
                centers.append(models.CollectionCenter(
                    name=name, district=district, city=city, state=state, 
                    latitude=lat, longitude=lon, 
                    capacity_kg=round(random.uniform(10000, 50000), 2)
                ))
                
        print(f"Adding {len(centers)} collection centers and {len(plants)} recycling plants...")
        db.add_all(centers)
        db.add_all(plants)
        db.commit()
        
        print("Seeding Logs for new centers...")
        today = date.today()
        categories = ["PET", "HDPE", "LDPE", "PP", "Other"]
        
        centers_db = db.query(models.CollectionCenter).all()
        
        # Generate 15 days of historical data for performance reasons
        for i in range(15):
            current_date = today - timedelta(days=15 - i)
            
            for center in centers_db:
                # Collection Logs
                for category in categories:
                    base_qty = (float(center.capacity_kg) / 30) * random.uniform(0.1, 0.4)  # type: ignore
                    if category == "PET": base_qty *= 1.5
                    
                    c_log = models.WasteCollectionLog(
                        center_id=center.id,
                        quantity_kg=round(base_qty, 1),
                        waste_category=category,
                        log_date=current_date
                    )
                    db.add(c_log)
                
                # Processing Logs
                daily_collected_est = (float(center.capacity_kg) / 30) * random.uniform(0.5, 1.2)  # type: ignore
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
        print("Real data seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_real_data()
