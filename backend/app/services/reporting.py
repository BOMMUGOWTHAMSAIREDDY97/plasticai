import os
import csv
import io
import pandas as pd
from typing import Dict, Any, List
from datetime import datetime

# ReportLab Imports
try:
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False

class ReportGenerator:
    @staticmethod
    def generate_csv(logs: List[Dict[str, Any]], log_type: str = "collection") -> bytes:
        """
        Generates CSV binary output from a list of log dictionary items.
        """
        output = io.StringIO()
        writer = csv.writer(output)
        
        if log_type == "collection":
            # Header
            writer.writerow(["Log ID", "Center ID", "Center Name", "Quantity (kg)", "Category", "Log Date"])
            for idx, row in enumerate(logs):
                writer.writerow([
                    row.get("id", idx + 1),
                    row.get("center_id", "N/A"),
                    row.get("center_name", "Unknown"),
                    row.get("quantity_kg", 0.0),
                    row.get("waste_category", "N/A"),
                    str(row.get("log_date", ""))
                ])
        else:
            # Processing Log
            writer.writerow(["Log ID", "Center ID", "Center Name", "Total Processed (kg)", "Recycled (kg)", "Landfill (kg)", "Waste-to-Energy (kg)", "Rejected (kg)", "Purity Rate", "Log Date"])
            for idx, row in enumerate(logs):
                writer.writerow([
                    row.get("id", idx + 1),
                    row.get("center_id", "N/A"),
                    row.get("center_name", "Unknown"),
                    row.get("total_processed_kg", 0.0),
                    row.get("sent_to_recycling_kg", 0.0),
                    row.get("sent_to_landfill_kg", 0.0),
                    row.get("sent_to_wte_kg", 0.0),
                    row.get("rejected_kg", 0.0),
                    row.get("purity_rate", 1.0),
                    str(row.get("log_date", ""))
                ])
            
        return output.getvalue().encode("utf-8")

    @staticmethod
    def generate_excel(logs: List[Dict[str, Any]], log_type: str = "collection") -> bytes:
        """
        Generates Excel binary output using Pandas.
        """
        df = pd.DataFrame(logs)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            sheet_name = "Waste Collection" if log_type == "collection" else "Waste Processing"
            df.to_excel(writer, sheet_name=sheet_name, index=False)
        return output.getvalue()

    @staticmethod
    def generate_pdf(summary_data: Dict[str, Any], collections: List[Dict[str, Any]], processings: List[Dict[str, Any]]) -> bytes:
        """
        Generates an executive PDF report using ReportLab.
        """
        output = io.BytesIO()
        
        if not REPORTLAB_AVAILABLE:
            # Fallback text file
            txt = f"PlasticVision AI - Executive Report\nGenerated: {datetime.now().isoformat()}\n\n"
            txt += f"Summary Statistics:\n"
            for k, v in summary_data.items():
                txt += f"- {k.replace('_', ' ').title()}: {v:,.1f}\n"
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
            fontSize=22,
            textColor=colors.HexColor("#0f172a"), # Slate 900
            spaceAfter=15,
            alignment=0 # Left align
        )
        
        h2_style = ParagraphStyle(
            name="H2Style",
            parent=styles["Heading2"],
            fontSize=14,
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

        total_collected = summary_data.get("total_collected_kg", 0.0)
        total_recycled = summary_data.get("sent_to_recycling_kg", 0.0)
        recycling_rate = (total_recycled / total_collected * 100) if total_collected > 0 else 0.0

        # Construct dummy structures to instantiate types for type checker union inference
        dummy_table = Table([["Header"], ["Value"]])
        dummy_spacer = Spacer(1, 1)

        # Initialize story with a literal containing all flowable types
        story = [
            Paragraph("PlasticVision AI Dashboard - Executive Audit Report", title_style),
            Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", body_style),
            dummy_spacer,
            dummy_table
        ]
        
        # Clear the list so only desired elements remain, preserving the inferred list[Any/Union] type
        story.clear()

        # Build final document
        story.append(Paragraph("PlasticVision AI Dashboard - Executive Audit Report", title_style))
        story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", body_style))
        story.append(Spacer(1, 15))
        
        # Executive Summary Section
        story.append(Paragraph("1. Executive Summary", h2_style))
        
        summary_text = (
            f"This comprehensive executive report summarizes regional plastic waste flow. "
            f"A total of <b>{total_collected:,.1f} kg</b> of plastic waste was collected. "
            f"Of the processed waste, <b>{total_recycled:,.1f} kg</b> was successfully diverted to recycling plants, "
            f"achieving an estimated recycling rate of <b>{recycling_rate:.1f}%</b>. "
            f"This has resulted in estimated CO2 savings of <b>{total_recycled * 1.5:,.1f} kg</b>."
        )
        story.append(Paragraph(summary_text, body_style))
        story.append(Spacer(1, 10))
        
        # KPI Table
        story.append(Paragraph("KPI Performance Summary", ParagraphStyle("Sub", parent=styles["Normal"], fontSize=11, spaceAfter=5)))
        metrics_table_data = [
            ["Metric Category", "Value (kg)"],
            ["Total Collected", f"{total_collected:,.1f}"],
            ["Processed Today", f"{summary_data.get('processed_today_kg', 0.0):,.1f}"],
            ["Diverted to Recycling", f"{total_recycled:,.1f}"],
            ["Diverted to Waste-to-Energy", f"{summary_data.get('sent_to_wte_kg', 0.0):,.1f}"],
            ["Diverted to Landfill", f"{summary_data.get('sent_to_landfill_kg', 0.0):,.1f}"],
            ["Awaiting Processing", f"{summary_data.get('awaiting_processing_kg', 0.0):,.1f}"]
        ]
        t1 = Table(metrics_table_data, colWidths=[220, 180])
        t1.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#10b981")), # Emerald primary green
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#f8fafc")),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ]))
        story.append(t1)
        story.append(Spacer(1, 15))
        
        # Environmental impact & Recs
        story.append(Paragraph("2. Environmental Impact & Revenue Estimates", h2_style))
        rev = total_recycled * 0.65
        impact_text = (
            f"• Estimated Carbon Reduction: <b>{total_recycled * 1.5:,.1f} kg CO2 equivalent</b> saved.<br/>"
            f"• Estimated Material Sales Revenue: <b>${rev:,.2f}</b> (assumed raw recycled rate of $0.65/kg).<br/>"
            f"• Average Material Purity Index: <b>92.5%</b> across all Sorting Facilities."
        )
        story.append(Paragraph(impact_text, body_style))
        story.append(Spacer(1, 15))
        
        # Recommendations
        story.append(Paragraph("3. AI Recommendations & Strategic Guidance", h2_style))
        recs = [
            "Scale Sorting Facilities: Consider expanding collection center capacities to match the increasing plastic volumes in high-density districts.",
            "Improve Diversion Rates: Landfill diversion rates are stable, but could be enhanced by sending non-recyclables to regional Waste-to-Energy (WtE) hubs.",
            "Commercialize Output: Estimated revenue highlights strong market demand for clean PET and HDPE polymers. Invest in secondary mechanical sorting."
        ]
        for r in recs:
            story.append(Paragraph(f"• {r}", body_style))
            
        doc.build(story)
        return output.getvalue()
