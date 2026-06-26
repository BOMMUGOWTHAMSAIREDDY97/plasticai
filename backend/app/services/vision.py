import cv2
import numpy as np
from ultralytics import YOLO
import base64
import os

# Load YOLOv8n model (nano) for fast inference
MODEL_PATH = "yolov8n.pt"
model_load_error = None

try:
    model = YOLO(MODEL_PATH)
except Exception as e:
    print(f"Error loading YOLO model: {e}")
    model_load_error = str(e)
    model = None

# 39: bottle, 41: cup, 67: cell phone (for easy testing!)
TARGET_CLASSES = [39, 41, 67]

def process_frame(frame_data_b64: str):
    """
    Process a base64 encoded image frame and return bounding boxes
    """
    if not model:
        # If model failed to load on Render, return a fake detection so the user knows!
        return [{
            "class_id": 999,
            "class_name": f"AI ERROR: {model_load_error}",
            "confidence": 1.0,
            "box": [10, 10, 300, 100]
        }]
        
    try:
        # Decode base64 image
        if ',' in frame_data_b64:
            frame_data_b64 = frame_data_b64.split(',')[1]
        
        img_bytes = base64.b64decode(frame_data_b64)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        if img is None:
            return []

        # Run inference
        results = model(img, classes=TARGET_CLASSES, verbose=False)
        
        detections = []
        for r in results:
            boxes = r.boxes
            for box in boxes:
                # Get coordinates
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = box.conf[0].item()
                cls = int(box.cls[0].item())
                
                # Map names
                name = "Unknown"
                if cls == 39: name = "Plastic Bottle"
                elif cls == 41: name = "Plastic Cup"
                elif cls == 67: name = "Phone (Test Mode!)"
                
                detections.append({
                    "class_id": cls,
                    "class_name": name,
                    "confidence": conf,
                    "box": [x1, y1, x2, y2]
                })
                
        return detections
    except Exception as e:
        print(f"Error processing frame: {e}")
        return [{
            "class_id": 999,
            "class_name": f"Frame Error: {str(e)}",
            "confidence": 1.0,
            "box": [10, 10, 300, 100]
        }]
