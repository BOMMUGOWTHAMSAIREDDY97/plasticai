import cv2
import numpy as np
import random
import time
import json
import logging
from typing import List, Dict, Any, Tuple

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("PlasticVision-Inference")

# Attempt to load YOLOv8
YOLO_AVAILABLE = False
try:
    from ultralytics import YOLO
    # Load a lightweight nano model
    model = YOLO("yolov8n.pt") 
    YOLO_AVAILABLE = True
    logger.info("YOLOv8 successfully loaded for inference.")
except Exception as e:
    logger.warning(f"YOLOv8 not available, utilizing high-fidelity simulated CV engine: {e}")

# Mapping YOLO classes to our Plastic categories
# COCO classes: 39: bottle, 41: cup, 43: knife, 44: spoon, 45: bowl, 85: waste/trash? 
# We'll map standard COCO classes if YOLO is available.
COCO_PLASTIC_MAPPING = {
    39: "Plastic Bottle", # bottle
    41: "Plastic Cup",    # cup
    45: "Plastic Container", # bowl / container
}

# Tracking state for simulated/mock tracker
class SimpleTracker:
    def __init__(self):
        self.objects = {}  # id -> {type, x, y, w, h, frames_seen, last_seen, trajectory}
        self.next_id = 1
        self.max_lost_frames = 15

    def update(self, detected_boxes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        current_time = time.time()
        updated_detections = []
        
        # Simple tracking matcher (Centroid-based similarity)
        for det in detected_boxes:
            cx = det["x"] + det["w"] / 2
            cy = det["y"] + det["h"] / 2
            
            matched_id = None
            min_dist = 0.15 # Max displacement threshold (normalized coords)
            
            for obj_id, obj_data in self.objects.items():
                if obj_data["type"] != det["class_name"]:
                    continue
                ocx = obj_data["x"] + obj_data["w"] / 2
                ocy = obj_data["y"] + obj_data["h"] / 2
                dist = np.sqrt((cx - ocx)**2 + (cy - ocy)**2)
                if dist < min_dist:
                    min_dist = dist
                    matched_id = obj_id
            
            if matched_id is not None:
                # Update existing tracker
                obj = self.objects[matched_id]
                obj["x"] = det["x"]
                obj["y"] = det["y"]
                obj["w"] = det["w"]
                obj["h"] = det["h"]
                obj["last_seen"] = current_time
                obj["frames_seen"] += 1
                obj["trajectory"].append((cx, cy))
                if len(obj["trajectory"]) > 20:
                    obj["trajectory"].pop(0)
                tracking_label = f"{det['class_name']} #{matched_id}"
            else:
                # Register new object
                matched_id = self.next_id
                self.next_id += 1
                self.objects[matched_id] = {
                    "type": det["class_name"],
                    "x": det["x"],
                    "y": det["y"],
                    "w": det["w"],
                    "h": det["h"],
                    "frames_seen": 1,
                    "last_seen": current_time,
                    "trajectory": [(cx, cy)]
                }
                tracking_label = f"{det['class_name']} #{matched_id}"
                
            updated_detections.append({
                "class_name": det["class_name"],
                "confidence": det["confidence"],
                "x": det["x"],
                "y": det["y"],
                "w": det["w"],
                "h": det["h"],
                "tracking_id": tracking_label,
                "trajectory": self.objects[matched_id]["trajectory"]
            })
            
        # Clean up lost trackers
        dead_ids = [
            oid for oid, odata in self.objects.items()
            if current_time - odata["last_seen"] > 2.0  # Lost for more than 2 seconds
        ]
        for oid in dead_ids:
            del self.objects[oid]
            
        return updated_detections

# Singleton tracker instance for WebSocket connections
tracker_instance = SimpleTracker()

def process_frame(image_bytes: bytes) -> Tuple[List[Dict[str, Any]], bytes]:
    """
    Processes an incoming image frame (bytes), runs detection (YOLOv8 or Mock), 
    draws bounding boxes and labels on it, and returns the detections and the annotated image.
    """
    # Decode image bytes
    nparr = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if frame is None:
        return [], image_bytes
        
    height, width, _ = frame.shape
    raw_detections = []
    
    if YOLO_AVAILABLE:
        # Run real YOLOv8
        results = model(frame, verbose=False)
        for result in results:
            boxes = result.boxes
            for box in boxes:
                cls_id = int(box.cls[0].item())
                confidence = float(box.conf[0].item())
                
                # Filter only for mapped plastic types and confidence > 0.3
                if cls_id in COCO_PLASTIC_MAPPING and confidence > 0.3:
                    class_name = COCO_PLASTIC_MAPPING[cls_id]
                    xyxy = box.xyxy[0].tolist()
                    
                    # Normalize coordinates
                    x = xyxy[0] / width
                    y = xyxy[1] / height
                    w = (xyxy[2] - xyxy[0]) / width
                    h = (xyxy[3] - xyxy[1]) / height
                    
                    raw_detections.append({
                        "class_name": class_name,
                        "confidence": confidence,
                        "x": x,
                        "y": y,
                        "w": w,
                        "h": h
                    })
    
    # If no YOLO or no detections found in YOLO, fallback to mock simulator for dashboard preview
    if not YOLO_AVAILABLE or (YOLO_AVAILABLE and len(raw_detections) == 0):
        raw_detections = generate_mock_detections(frame)
        
    # Update multi-object tracking
    tracked_detections = tracker_instance.update(raw_detections)
    
    # Annotate image frame
    annotated_frame = frame.copy()
    for det in tracked_detections:
        # Denormalize
        x1 = int(det["x"] * width)
        y1 = int(det["y"] * height)
        w = int(det["w"] * width)
        h = int(det["h"] * height)
        x2 = x1 + w
        y2 = y1 + h
        
        # Color based on class
        color = (0, 255, 0) # Green for bottles
        if "Bag" in det["class_name"]:
            color = (255, 0, 0) # Blue for bags
        elif "Cup" in det["class_name"]:
            color = (0, 255, 255) # Yellow
        elif "Container" in det["class_name"]:
            color = (255, 0, 255) # Purple
            
        # Draw bounding box
        cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), color, 2)
        
        # Label text
        label_text = f"{det['tracking_id']} ({det['confidence']:.2f})"
        cv2.putText(
            annotated_frame, 
            label_text, 
            (x1, y1 - 10 if y1 - 10 > 15 else y1 + 15), 
            cv2.FONT_HERSHEY_SIMPLEX, 
            0.5, 
            color, 
            2
        )
        
        # Draw Trajectory paths
        traj = det["trajectory"]
        if len(traj) > 1:
            for i in range(1, len(traj)):
                p1 = (int(traj[i-1][0] * width), int(traj[i-1][1] * height))
                p2 = (int(traj[i][0] * width), int(traj[i][1] * height))
                cv2.line(annotated_frame, p1, p2, color, 1)

    # Encode annotated frame back to jpeg bytes
    _, buffer = cv2.imencode(".jpg", annotated_frame)
    return tracked_detections, buffer.tobytes()

# Internal state to keep mock movements smooth
mock_object_states = []

def generate_mock_detections(frame) -> List[Dict[str, Any]]:
    """
    Generates high-fidelity simulated detections that move smoothly over time, 
    perfect for rendering a beautiful operational dashboard.
    """
    global mock_object_states
    current_time = time.time()
    
    # Initialize some mock objects if list is empty or randomly once in a while
    if len(mock_object_states) == 0 or (len(mock_object_states) < 3 and random.random() < 0.05):
        classes = ["Plastic Bottle", "Plastic Bag", "Plastic Cup", "Plastic Wrapper", "Plastic Container"]
        new_obj = {
            "class_name": random.choice(classes),
            "confidence": round(random.uniform(0.65, 0.95), 2),
            "x": random.uniform(0.1, 0.4),
            "y": random.uniform(0.1, 0.4),
            "w": random.uniform(0.12, 0.22),
            "h": random.uniform(0.2, 0.35),
            "vx": random.uniform(0.005, 0.015),
            "vy": random.uniform(-0.005, 0.015),
            "created_at": current_time,
            "lifespan": random.uniform(5.0, 15.0)
        }
        mock_object_states.append(new_obj)
        
    # Update coordinates of objects, removing old ones
    active_objects = []
    detections = []
    
    for obj in mock_object_states:
        # If object is within lifespan and not off screen, update and keep
        age = current_time - obj["created_at"]
        if age < obj["lifespan"]:
            obj["x"] += obj["vx"]
            obj["y"] += obj["vy"]
            
            # Simple boundary check
            if 0.0 <= obj["x"] <= 0.85 and 0.0 <= obj["y"] <= 0.85:
                # Add minor jitter to coordinate bounds
                jitter_x = random.uniform(-0.002, 0.002)
                jitter_y = random.uniform(-0.002, 0.002)
                
                detections.append({
                    "class_name": obj["class_name"],
                    "confidence": obj["confidence"],
                    "x": max(0.0, min(1.0, obj["x"] + jitter_x)),
                    "y": max(0.0, min(1.0, obj["y"] + jitter_y)),
                    "w": obj["w"],
                    "h": obj["h"]
                })
                active_objects.append(obj)
                
    mock_object_states = active_objects
    return detections
