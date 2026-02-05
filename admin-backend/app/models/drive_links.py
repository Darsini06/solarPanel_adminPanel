from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

class DriveLinkCreate(BaseModel):
    drive_link_1: str
    drive_link_2: str

class DriveLinkResponse(BaseModel):
    id: str
    drive_link_1: str
    drive_link_2: str
    user_id: str
    user_email: str
    user_name: str
    created_at: datetime
    has_pdf: bool = False
    pdf_id: Optional[str] = None
    pdf_filename: Optional[str] = None

class ReportGenerateRequest(BaseModel):
    link_id: str
    drive_link_1: str
    drive_link_2: str

class ReportResponse(BaseModel):
    report_id: str
    generated_at: datetime
    generated_by: str
    link_id: str
    drive_link_1: str
    drive_link_2: str
    comparison_summary: dict
    file_type_analysis: dict
    common_files: list
    unique_files_link1: list
    unique_files_link2: list
    file_details: dict
    recommendations: list