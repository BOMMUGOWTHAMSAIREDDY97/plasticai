import base64
import os
import cv2
import numpy as np

# Load MobileNet SSD Model
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'models')
PROTOTXT = os.path.join(MODEL_DIR, 'MobileNetSSD_deploy.prototxt')
MODEL = os.path.join(MODEL_DIR, 'MobileNetSSD_deploy.caffemodel')

net = None
if os.path.exists(PROTOTXT) and os.path.exists(MODEL):
    try:
        net = cv2.dnn.readNetFromCaffe(PROTOTXT, MODEL)
    except Exception as e:
        print(f"Failed to load DNN model: {e}")

CLASSES = ["background", "aeroplane", "bicycle", "bird", "boat",
           "bottle", "bus", "car", "cat", "chair", "cow", "diningtable",
           "dog", "horse", "motorbike", "person", "pottedplant", "sheep",
           "sofa", "train", "tvmonitor"]

def process_frame(frame_data_b64: str):
    """
    Real-time AI object detection using OpenCV DNN + MobileNet SSD.
    Takes nearly 0 RAM and is highly optimized.
    """
    global net
    
    try:
        if ',' in frame_data_b64:
            frame_data_b64 = frame_data_b64.split(',')[1]
            
        img_bytes = base64.b64decode(frame_data_b64)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        if frame is None or net is None:
            return []
            
        (h, w) = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 0.007843, (300, 300), 127.5)
        
        net.setInput(blob)
        detections = net.forward()
        
        detected_objects = []
        
        for i in np.arange(0, detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            
            if confidence > 0.4:
                idx = int(detections[0, 0, i, 1])
                class_name = CLASSES[idx]
                
                # We specifically look for "bottle" to identify plastic
                if class_name == "bottle":
                    box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                    (startX, startY, endX, endY) = box.astype("int")
                    
                    detected_objects.append({
                        "class_id": 5, # Bottle index
                        "class_name": "PET Bottle",
                        "confidence": float(confidence),
                        "box": [int(startX), int(startY), int(endX), int(endY)]
                    })
                    
        return detected_objects
        
    except Exception as e:
        print(f"Error in DNN detection: {e}")
        return []
