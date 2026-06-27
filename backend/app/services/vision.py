import base64
import os
import cv2
import numpy as np

# Try importing ultralytics (will fail gracefully if not installed yet)
try:
    from ultralytics import YOLO
    
    # Initialize YOLOv8 model (downloads yolov8n.pt if not present)
    model = YOLO('yolov8n.pt')
except ImportError:
    model = None
    print("WARNING: ultralytics is not installed. YOLOv8 will not work.")

# We map relevant COCO classes to a generic "Plastic Item" or specific name
# COCO indices: 39 (bottle), 41 (cup), 42 (fork), 43 (knife), 44 (spoon), 45 (bowl)
PLASTIC_CLASSES = {
    39: "Plastic Bottle",
    41: "Plastic Cup",
    42: "Plastic Fork",
    43: "Plastic Knife",
    44: "Plastic Spoon",
    45: "Plastic Bowl"
}

def process_frame(frame_data_b64: str):
    """
    Real-time AI object detection using YOLOv8.
    """
    if model is None:
        return []
        
    try:
        if ',' in frame_data_b64:
            frame_data_b64 = frame_data_b64.split(',')[1]
            
        img_bytes = base64.b64decode(frame_data_b64)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return []
            
        # Run YOLOv8 inference
        results = model(frame, stream=True, verbose=False)
        
        detected_objects = []
        
        for r in results:
            boxes = r.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                confidence = float(box.conf[0])
                
                # Check if it's one of our plastic target classes and > 40% confidence
                if cls_id in PLASTIC_CLASSES and confidence > 0.4:
                    # Get bounding box coordinates (x1, y1, x2, y2)
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    
                    detected_objects.append({
                        "class_id": cls_id,
                        "class_name": PLASTIC_CLASSES[cls_id],
                        "confidence": confidence,
                        "box": [int(x1), int(y1), int(x2), int(y2)]
                    })
                    
        return detected_objects
        
    except Exception as e:
        print(f"Error in YOLOv8 detection: {e}")
        return []
