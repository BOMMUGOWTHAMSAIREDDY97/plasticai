from sqlalchemy.orm import Session
from ..models import WasteCollectionLog, WasteProcessingLog, CollectionCenter
from sqlalchemy import func
from datetime import date, timedelta
from typing import List, Dict, Any

class InsightGenerator:
    @staticmethod
    def get_ai_insights(db: Session) -> List[Dict[str, Any]]:
        """
        Generate dynamic insights and recommendations based on database logs.
        """
        insights = []
        
        # Calculate active locations
        total_centers = db.query(CollectionCenter).count()
        if total_centers == 0:
            return [
                {
                    "id": 1,
                    "title": "Initial System Setup Complete",
                    "description": "Please add Collection Centers and Recycling Plants in the Administration panel to begin monitoring.",
                    "type": "info",
                    "metric": "0 Facilities",
                    "policy_directives": [
                        "Mandate all regional administrators to register collection centers within 7 days.",
                        "Establish baseline operational targets for the newly registered facilities."
                    ]
                }
            ]

        # 1. Total waste collected this month vs last month
        today = date.today()
        first_of_this_month = date(today.year, today.month, 1)
        last_month_end = first_of_this_month - timedelta(days=1)
        first_of_last_month = date(last_month_end.year, last_month_end.month, 1)
        
        this_month_collected = db.query(func.sum(WasteCollectionLog.quantity_kg)).filter(
            WasteCollectionLog.log_date >= first_of_this_month
        ).scalar() or 0.0
        
        last_month_collected = db.query(func.sum(WasteCollectionLog.quantity_kg)).filter(
            WasteCollectionLog.log_date >= first_of_last_month,
            WasteCollectionLog.log_date <= last_month_end
        ).scalar() or 0.0
        
        if last_month_collected > 0:
            pct_diff = ((this_month_collected - last_month_collected) / last_month_collected) * 100
            if pct_diff > 0:
                insights.append({
                    "id": 1,
                    "title": "Increase in Waste Influx",
                    "description": f"Plastic waste collection has increased by {pct_diff:.1f}% compared to last month. Ensure downstream processing facilities have sufficient capacity.",
                    "type": "warning",
                    "metric": f"+{pct_diff:.1f}% Influx",
                    "policy_directives": [
                        "Allocate additional collection resources to high-density areas.",
                        "Review capacity limits at primary downstream processing facilities.",
                        "Initiate a targeted public awareness campaign regarding proper sorting."
                    ]
                })
            else:
                insights.append({
                    "id": 1,
                    "title": "Stable Waste Collection",
                    "description": f"Plastic waste collection volume has stabilized, showing a minor change of {pct_diff:.1f}% compared to last month.",
                    "type": "success",
                    "metric": f"{pct_diff:.1f}% Influx",
                    "policy_directives": [
                        "Maintain current operational budget and routing schedules.",
                        "Shift focus towards improving the purity of collected waste streams."
                    ]
                })
        else:
            insights.append({
                "id": 1,
                "title": "Initial Monthly Logging Active",
                "description": f"Total plastic waste collected this month is {this_month_collected:,.0f} kg. Collecting historical baseline data.",
                "type": "info",
                "metric": f"{this_month_collected:,.0f} kg",
                "policy_directives": [
                    "Require daily log submissions to establish an accurate baseline.",
                    "Conduct an end-of-month review to set future collection targets."
                ]
            })

        # 2. Recycling Rate Trend
        total_processed = db.query(func.sum(WasteProcessingLog.total_processed_kg)).scalar() or 0.0
        total_recycled = db.query(func.sum(WasteProcessingLog.sent_to_recycling_kg)).scalar() or 0.0
        
        if total_processed > 0:
            recycling_rate = (total_recycled / total_processed) * 100
            if recycling_rate > 60:
                insights.append({
                    "id": 2,
                    "title": "High Recycling Efficiency",
                    "description": f"The cumulative recycling rate is standing strong at {recycling_rate:.1f}%. Processing centers are successfully sorting and recovering recyclable polymers.",
                    "type": "success",
                    "metric": f"{recycling_rate:.1f}% Rate",
                    "policy_directives": [
                        "Reward top-performing sorting facilities with performance incentives.",
                        "Publish an annual sustainability report highlighting the achieved recycling efficiency.",
                        "Increase targets for next quarter by 5%."
                    ]
                })
            else:
                insights.append({
                    "id": 2,
                    "title": "Recycling Rate Improvement Needed",
                    "description": f"The current recycling rate is {recycling_rate:.1f}%. Investigate Sorting Facility metrics to identify purity bottleneck causes.",
                    "type": "info",
                    "metric": f"{recycling_rate:.1f}% Rate",
                    "policy_directives": [
                        "Audit underperforming sorting facilities within the next 14 days.",
                        "Implement mandatory re-training for manual sorting staff.",
                        "Evaluate potential upgrades for automated optical sorting machinery."
                    ]
                })
        else:
            insights.append({
                "id": 2,
                "title": "Processing Logs Pending",
                "description": "Establish log entries for waste processing to evaluate total recycling rate benchmarks.",
                "type": "info",
                "metric": "0% Rate",
                "policy_directives": [
                    "Enforce mandatory processing logging protocols for all plant managers."
                ]
            })

        # 3. Environmental Impact Insight: CO2 savings
        co2_saved_kg = total_recycled * 1.5
        if co2_saved_kg > 0:
            insights.append({
                "id": 3,
                "title": "Estimated Carbon Reductions",
                "description": f"By recycling {total_recycled:,.0f} kg of plastic polymers, the system has offset approximately {co2_saved_kg:,.0f} kg of CO2 equivalent emissions.",
                "type": "success",
                "metric": f"{co2_saved_kg/1000:.1f}t CO2 Saved",
                "policy_directives": [
                    "Submit carbon offset data for regional environmental tax credits.",
                    "Incorporate emission reduction metrics into public corporate communications."
                ]
            })
            
        # 4. Landfill Diversion Rate
        total_landfill = db.query(func.sum(WasteProcessingLog.sent_to_landfill_kg)).scalar() or 0.0
        if total_processed > 0:
            landfill_rate = (total_landfill / total_processed) * 100
            if landfill_rate < 20:
                insights.append({
                    "id": 4,
                    "title": "Landfill Diversion Success",
                    "description": f"Only {landfill_rate:.1f}% of processed plastic was sent to landfills. Diverting plastic from long-term decomposition sites matches regional goals.",
                    "type": "success",
                    "metric": f"{100 - landfill_rate:.1f}% Diverted",
                    "policy_directives": [
                        "Formalize current waste diversion protocols as permanent policy.",
                        "Explore markets for upcycling the remaining non-recyclable fractions."
                    ]
                })
            else:
                insights.append({
                    "id": 4,
                    "title": "High Landfill Dependency",
                    "description": f"Approximately {landfill_rate:.1f}% of plastic is routing to landfills. Consider upgrading Waste-to-Energy or sorting facilities to capture value.",
                    "type": "warning",
                    "metric": f"{landfill_rate:.1f}% Landfill",
                    "policy_directives": [
                        "Impose a temporary restriction on landfill tipping to encourage secondary sorting.",
                        "Subsidize feasibility studies for new Waste-to-Energy infrastructure."
                    ]
                })

        # 5. Top District by Collection Volume
        top_district_query = db.query(
            CollectionCenter.district, 
            func.sum(WasteCollectionLog.quantity_kg).label("total")
        ).join(
            WasteCollectionLog, CollectionCenter.id == WasteCollectionLog.center_id
        ).group_by(
            CollectionCenter.district
        ).order_by(
            func.sum(WasteCollectionLog.quantity_kg).desc()
        ).first()

        if top_district_query:
            insights.append({
                "id": 5,
                "title": "Regional Hotspot Identified",
                "description": f"Waste collection volume is highest in {top_district_query[0]} district, accounting for {top_district_query[1]:,.0f} kg of plastic waste.",
                "type": "info",
                "metric": f"{top_district_query[0]}",
                "policy_directives": [
                    f"Direct 20% more funding to {top_district_query[0]} for processing infrastructure.",
                    f"Assign specialized monitoring teams to audit collection centers in {top_district_query[0]}.",
                    "Implement localized behavioral interventions to reduce waste generation at the source."
                ]
            })

        return insights
