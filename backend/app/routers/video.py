from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..services import vision
import json

router = APIRouter(tags=["Video"])

@router.websocket("/ws/video")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive base64 encoded image frame from frontend
            data = await websocket.receive_text()
            
            # Process frame using vision service
            detections = vision.process_frame(data)
            
            # Send back bounding boxes and classifications
            await websocket.send_json({"detections": detections})
            
    except WebSocketDisconnect:
        print("Client disconnected from video stream")
    except Exception as e:
        print(f"WebSocket error: {e}")
