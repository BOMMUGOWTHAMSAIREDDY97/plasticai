import base64
import time
import json
import logging
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.orm import Session

from app.api import deps
from app.core.database import get_db
from app.models.detection import Detection, PlasticType, TrackingEvent
from app.models.user import User
from app.schemas.detection import DetectionOut, DetectionCreate, PlasticTypeOut
from app.services.inference import process_frame

router = APIRouter()
logger = logging.getLogger("PlasticVision-Detections-API")

@router.get("/", response_model=List[DetectionOut])
def read_detections(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    location: Optional[str] = None,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Retrieve historical detections.
    """
    query = db.query(Detection)
    if location:
        query = query.filter(Detection.location_label == location)
    return query.order_by(Detection.timestamp.desc()).offset(skip).limit(limit).all()

@router.get("/plastic-types", response_model=List[PlasticTypeOut])
def read_plastic_types(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Retrieve available plastic types.
    """
    return db.query(PlasticType).all()

@router.websocket("/live")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    """
    WebSocket endpoint for real-time frame streaming and object detection/tracking.
    Receives raw JPEG frames, processes them, writes to DB on new tracked objects,
    and returns annotated frames and tracking metadata.
    """
    await websocket.accept()
    logger.info("Live WebSocket camera stream connected.")
    
    # Cache for plastic type IDs to avoid querying DB on every frame
    plastic_type_cache = {}
    
    # Store tracked object IDs that have already been saved to the DB in this session
    saved_tracking_ids = set()

    try:
        while True:
            # Receive data from client. Could be text (base64) or binary
            data = await websocket.receive_text()
            
            try:
                # Expecting JSON with a base64 encoded frame
                message = json.loads(data)
                img_data_b64 = message.get("frame")
                location = message.get("location", "Webcam Feed")
                
                if not img_data_b64:
                    continue
                
                # Strip base64 headers if present
                if "," in img_data_b64:
                    img_data_b64 = img_data_b64.split(",")[1]
                    
                img_bytes = base64.b64decode(img_data_b64)
                
                # Run computer vision inference and multi-object tracking
                detections, annotated_bytes = process_frame(img_bytes)
                
                # Encode annotated frame to send back
                annotated_b64 = base64.b64encode(annotated_bytes).decode("utf-8")
                
                # Commit detections of interest to database (avoid duplicate insertions for same tracking ID)
                for det in detections:
                    tracking_id = det["tracking_id"]
                    
                    if tracking_id not in saved_tracking_ids:
                        class_name = det["class_name"]
                        
                        # Get or create plastic type in database
                        if class_name not in plastic_type_cache:
                            ptype = db.query(PlasticType).filter(PlasticType.name == class_name).first()
                            if not ptype:
                                # Standard risk weights: Bottle = 1.2, Bag = 1.5, Cup = 1.0, Container = 1.3, Wrapper = 1.1
                                weights = {
                                    "Plastic Bottle": 1.2,
                                    "Plastic Bag": 1.5,
                                    "Plastic Container": 1.3,
                                    "Plastic Wrapper": 1.1,
                                    "Plastic Cup": 1.0,
                                    "Plastic Packaging Waste": 1.4
                                }
                                codes = {
                                    "Plastic Bottle": "PET 01",
                                    "Plastic Bag": "LDPE 04",
                                    "Plastic Container": "HDPE 02",
                                    "Plastic Wrapper": "PP 05",
                                    "Plastic Cup": "PS 06",
                                    "Plastic Packaging Waste": "OTHER 07"
                                }
                                ptype = PlasticType(
                                    name=class_name,
                                    default_risk_weight=weights.get(class_name, 1.0),
                                    recycling_code=codes.get(class_name, "07")
                                )
                                db.add(ptype)
                                db.commit()
                                db.refresh(ptype)
                            plastic_type_cache[class_name] = ptype.id
                        
                        ptype_id = plastic_type_cache[class_name]
                        
                        # Create Detection log
                        db_detection = Detection(
                            plastic_type_id=ptype_id,
                            confidence=det["confidence"],
                            bounding_box_x=det["x"],
                            bounding_box_y=det["y"],
                            bounding_box_w=det["w"],
                            bounding_box_h=det["h"],
                            location_label=location
                        )
                        db.add(db_detection)
                        db.commit()
                        db.refresh(db_detection)
                        
                        # Register Tracking Event
                        db_event = TrackingEvent(
                            detection_id=db_detection.id,
                            tracking_id=tracking_id,
                            trajectory_data_json=json.dumps(det.get("trajectory", []))
                        )
                        db.add(db_event)
                        db.commit()
                        
                        saved_tracking_ids.add(tracking_id)
                
                # Send result back to client
                response = {
                    "status": "success",
                    "annotated_frame": f"data:image/jpeg;base64,{annotated_b64}",
                    "detections": [
                        {
                            "class_name": d["class_name"],
                            "confidence": d["confidence"],
                            "tracking_id": d["tracking_id"]
                        } for d in detections
                    ],
                    "active_count": len(detections)
                }
                await websocket.send_text(json.dumps(response))
                
            except Exception as inner_e:
                logger.error(f"Error processing frame: {inner_e}")
                await websocket.send_text(json.dumps({
                    "status": "error",
                    "detail": "Failed to process frame"
                }))
                
    except WebSocketDisconnect:
        logger.info("Live WebSocket camera stream disconnected.")
    except Exception as e:
        logger.error(f"WebSocket connection error: {e}")
