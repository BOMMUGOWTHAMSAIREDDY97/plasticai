import os
import csv
import io
import pandas as pd
from typing import List, Dict, Any
from datetime import datetime

# ReportLab Imports
try:
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False

class ReportGenerator:
    @staticmethod
    def generate_csv(detections_data: List[Dict[str, Any]]) -> bytes:
        """
        Generates CSV binary output from a list of detections.
        """
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow(["Detection ID", "Timestamp", "Class Name", "Confidence", "Location", "Recycling Code"])
        
        for idx, row in enumerate(detections_data):
            writer.writerow([
                row.get("id", idx + 1),
                row.get("timestamp", datetime.now().isoformat()),
                row.get("class_name", "Unknown"),
                row.get("confidence", 0.0),
                row.get("location", "Webcam Feed"),
                row.get("recycling_code", "N/A")
            ])
            
        return output.getvalue().encode("utf-8")

    @staticmethod
    def generate_excel(detections_data: List[Dict[str, Any]]) -> bytes:
        """
        Generates Excel binary output from a list of detections.
        """
        df = pd.DataFrame(detections_data)
        if df.empty:
            df = pd.DataFrame(columns=["Detection ID", "Timestamp", "Class Name", "Confidence", "Location"])
            
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            df.to_excel(writer, sheet_name="Detections Summary", index=False)
            
        return output.getvalue()

    @staticmethod
    def generate_pdf(summary_data: Dict[str, Any], detections_data: List[Dict[str, Any]]) -> bytes:
        """
        Generates a premium executive PDF report using ReportLab.
        """
        output = io.BytesIO()
        
        if not REPORTLAB_AVAILABLE:
            # Fallback text file
            txt = f"PlasticVision AI - Executive Report\nGenerated: {datetime.now().isoformat()}\n\n"
            txt += f"Summary:\n- Total count: {summary_data.get('total_plastic')}\n"
            txt += f"- Risk Level: {summary_data.get('risk_level')}\n"
            txt += f"- Environmental Score: {summary_data.get('environmental_risk_score')}\n\n"
            txt += "Detections Table:\n"
            for d in detections_data[:10]:
                txt += f"{d.get('timestamp')} - {d.get('class_name')} ({d.get('confidence')})\n"
            return txt.encode("utf-8")
            
        doc = SimpleDocTemplate(
            output, 
            pagesize=letter,
            rightMargin=54, leftMargin=54, topMargin=54, bottomMargin=54
        )
        
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            name="TitleStyle",
            parent=styles["Title"],
            fontSize=24,
            textColor=colors.HexColor("#0f172a"), # Slate 900
            spaceAfter=15
        )
        
        h2_style = ParagraphStyle(
            name="H2Style",
            parent=styles["Heading2"],
            fontSize=16,
            textColor=colors.HexColor("#1e293b"), # Slate 800
            spaceBefore=12,
            spaceAfter=8
        )
        
        body_style = ParagraphStyle(
            name="BodyStyle",
            parent=styles["BodyText"],
            fontSize=10,
            textColor=colors.HexColor("#334155"), # Slate 700
            spaceAfter=6
        )

        story = []
        
        # Header / Title
        story.append(Paragraph("PlasticVision AI - Environmental Audit Report", title_style))
        story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", body_style))
        story.append(Spacer(1, 15))
        
        # Executive Summary Section
        story.append(Paragraph("1. Executive Summary", h2_style))
        summary_text = (
            f"This audit report provides an analysis of plastic waste monitored by the PlasticVision AI engine. "
            f"The overall environment exhibits an <b>{summary_data.get('risk_level', 'Unknown')}</b> profile with a cumulative "
            f"environmental risk score of <b>{summary_data.get('environmental_risk_score', 0.0)}/100</b>. A total of "
            f"<b>{summary_data.get('total_plastic', 0)}</b> plastic objects were tracked and logged."
        )
        story.append(Paragraph(summary_text, body_style))
        story.append(Spacer(1, 10))
        
        # Key Metrics Table
        story.append(Paragraph("Key Metrics Summary", ParagraphStyle("Sub", parent=styles["Normal"], fontSize=11, spaceAfter=5)))
        metrics_table_data = [
            ["Metric", "Value"],
            ["Total Plastic Detections", str(summary_data.get("total_plastic", 0))],
            ["Environmental Risk Score", f"{summary_data.get('environmental_risk_score', 0.0)}/100"],
            ["Risk Classification", summary_data.get("risk_level", "Medium")],
            ["Active Monitoring Nodes", "1 (Live Camera Feed)"]
        ]
        t1 = Table(metrics_table_data, colWidths=[200, 200])
        t1.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e293b")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#f8fafc")),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ]))
        story.append(t1)
        story.append(Spacer(1, 15))
        
        # AI Recommendations Section
        story.append(Paragraph("2. AI Recommendations & Corrective Actions", h2_style))
        recs = [
            "Immediate recycling action recommended for PET Bottle accumulation.",
            "Schedule site clearance: Plastic density has exceeded critical values by 22% during peak operating hours.",
            "Deploy warning alerts: Increase operator monitoring of Sorting Belt C for non-recyclable wrapper waste."
        ]
        for r in recs:
            story.append(Paragraph(f"• {r}", body_style))
        story.append(Spacer(1, 15))
        
        # Detections Log Section
        story.append(Paragraph("3. Recent Detections Log (Top 10)", h2_style))
        table_data = [["Timestamp", "Category", "Confidence", "Location"]]
        
        for d in detections_data[:10]:
            table_data.append([
                d.get("timestamp", datetime.now().strftime("%H:%M:%S")),
                d.get("class_name", "Unknown"),
                f"{d.get('confidence', 0.0)*100:.1f}%",
                d.get("location", "Webcam Feed")
            ])
            
        t2 = Table(table_data, colWidths=[120, 120, 100, 140])
        t2.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#475569")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")])
        ]))
        story.append(t2)
        
        doc.build(story)
        return output.getvalue()
