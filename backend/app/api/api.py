from fastapi import APIRouter
from app.api.v1 import auth, detections, analytics, predictions, reports

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(detections.router, prefix="/detections", tags=["detections"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
