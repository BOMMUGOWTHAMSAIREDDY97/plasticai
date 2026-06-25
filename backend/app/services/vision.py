import cv2
import numpy as np
from ultralytics import YOLO
import base64
import os

# Load YOLOv8n model (nano) for fast inference
# It will download automatically on first run if not found
MODEL_PATH = "yolov8n.pt"

try:
    model = YOLO(MODEL_PATH)
except Exception as e:
    print(f"Error loading YOLO model: {e}")
    model = None

# Filter only plastic-related classes or just detect bottles for MVP
# In COCO dataset (used by yolov8n), class 39 is 'bottle'
# We will just detect bottles as a proxy for plastic waste in the MVP.
TARGET_CLASSES = [39]

def process_frame(frame_data_b64: str):
    """
    Process a base64 encoded image frame and return bounding boxes
    """
    if not model:
        return []
        
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
                
                detections.append({
                    "class_id": cls,
                    "class_name": "Plastic Bottle" if cls == 39 else "Unknown",
                    "confidence": conf,
                    "box": [x1, y1, x2, y2]
                })
                
        return detections
    except Exception as e:
        print(f"Error processing frame: {e}")
        return []
