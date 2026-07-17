from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from .. import models, schemas, database
from ..routers.auth import get_current_user
from ..services.reporting import ReportGenerator
from sqlalchemy import func
from typing import List
import io

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/list", response_model=List[schemas.ReportOut])
def list_reports(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    """
    Get all generated reports list.
    """
    return db.query(models.Report).order_by(models.Report.generated_at.desc()).all()

@router.post("/generate", response_model=schemas.ReportOut)
def generate_report(title: str, report_type: str = "Executive", db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    """
    Create a new report placeholder in the database.
    """
    db_report = models.Report(
        title=title,
        report_type=report_type,
        generated_by_id=current_user.id
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@router.get("/download/{format}")
def download_reports(format: str, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    """
    Download logs in pdf, xlsx, or csv formats.
    """
    # Fetch all logs for formatting
    coll_logs = db.query(models.WasteCollectionLog).join(models.CollectionCenter).all()
    proc_logs = db.query(models.WasteProcessingLog).join(models.CollectionCenter).all()

    # Convert to dictionaries
    coll_list = []
    for cl in coll_logs:
        coll_list.append({
            "id": cl.id,
            "center_id": cl.center_id,
            "center_name": cl.center.name,
            "quantity_kg": cl.quantity_kg,
            "waste_category": cl.waste_category,
            "log_date": str(cl.log_date)
        })

    proc_list = []
    for pl in proc_logs:
        proc_list.append({
            "id": pl.id,
            "center_id": pl.center_id,
            "center_name": pl.center.name,
            "total_processed_kg": pl.total_processed_kg,
            "sent_to_recycling_kg": pl.sent_to_recycling_kg,
            "sent_to_landfill_kg": pl.sent_to_landfill_kg,
            "sent_to_wte_kg": pl.sent_to_wte_kg,
            "rejected_kg": pl.rejected_kg,
            "purity_rate": pl.purity_rate,
            "log_date": str(pl.log_date)
        })

    # Fallback to defaults if database is empty
    if not coll_list:
        coll_list = [{"center_name": "Demo Center", "quantity_kg": 5000.0, "waste_category": "PET", "log_date": "2026-07-15"}]
        proc_list = [{"center_name": "Demo Center", "total_processed_kg": 4500.0, "sent_to_recycling_kg": 3500.0, "sent_to_landfill_kg": 500.0, "sent_to_wte_kg": 500.0, "rejected_kg": 0.0, "purity_rate": 0.93, "log_date": "2026-07-15"}]

    if format.lower() == "csv":
        data_bytes = ReportGenerator.generate_csv(coll_list, log_type="collection")
        media_type = "text/csv"
        filename = f"waste_report_{current_user.id}.csv"
    elif format.lower() == "excel" or format.lower() == "xlsx":
        data_bytes = ReportGenerator.generate_excel(coll_list, log_type="collection")
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        filename = f"waste_report_{current_user.id}.xlsx"
    elif format.lower() == "pdf":
        # Formulate summary metrics
        total_collected = sum(x["quantity_kg"] for x in coll_list)
        total_recycled = sum(x["sent_to_recycling_kg"] for x in proc_list)
        total_landfill = sum(x["sent_to_landfill_kg"] for x in proc_list)
        total_wte = sum(x["sent_to_wte_kg"] for x in proc_list)
        processed_today = proc_list[0]["total_processed_kg"] if proc_list else 0.0
        
        summary = {
            "total_collected_kg": total_collected,
            "processed_today_kg": processed_today,
            "sent_to_recycling_kg": total_recycled,
            "sent_to_landfill_kg": total_landfill,
            "sent_to_wte_kg": total_wte,
            "awaiting_processing_kg": max(0.0, total_collected - sum(x["total_processed_kg"] for x in proc_list))
        }
        data_bytes = ReportGenerator.generate_pdf(summary, coll_list, proc_list)
        media_type = "application/pdf"
        filename = f"waste_report_{current_user.id}.pdf"
    else:
        raise HTTPException(status_code=400, detail="Invalid format. Supported formats: csv, excel, pdf")

    return StreamingResponse(
        io.BytesIO(data_bytes),
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
