"""
Solar Panel Inspection Comparison PDF Generator
Premium Dashboard-Style Design - Dynamic Metadata Only
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch, mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime
from typing import List, Dict, Any
from app.utils.merge_sort import merge_sort_multiple_keys

# --- Color Palette ---
COLOR_PRIMARY = colors.HexColor('#f97316')  # Orange-500
COLOR_SECONDARY = colors.HexColor('#0f172a')  # Slate-900
COLOR_ACCENT = colors.HexColor('#3b82f6')     # Blue-500
COLOR_BG_LIGHT = colors.HexColor('#f8fafc')   # Slate-50
COLOR_BORDER = colors.HexColor('#e2e8f0')     # Slate-200
COLOR_TEXT_MAIN = colors.HexColor('#334155')  # Slate-700
COLOR_TEXT_LIGHT = colors.HexColor('#64748b') # Slate-500
COLOR_SUCCESS = colors.HexColor('#22c55e') # Green
COLOR_DANGER = colors.HexColor('#ef4444') # Red
COLOR_INFO = colors.HexColor('#3b82f6') # Blue

def format_file_size(bytes_size):
    if not bytes_size: return '0 B'
    k = 1024
    sizes = ['B', 'KB', 'MB', 'GB']
    i = 0
    size = float(bytes_size)
    while size >= k and i < len(sizes) - 1:
        size /= k
        i += 1
    return f"{size:.1f} {sizes[i]}"

def draw_header(canvas, doc):
    canvas.saveState()
    # Top Bar Background
    canvas.setFillColor(COLOR_SECONDARY)
    canvas.rect(0, 280*mm, 210*mm, 17*mm, fill=1, stroke=0)
    # Logo / Brand Name
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 16)
    canvas.drawString(15*mm, 286*mm, "SOLAR INSPECTION SYSTEM")
    # Report Label
    canvas.setFont("Helvetica", 10)
    canvas.drawRightString(195*mm, 286*mm, "COMPARISON REPORT")
    # Orange Accent Line
    canvas.setFillColor(COLOR_PRIMARY)
    canvas.rect(0, 279*mm, 210*mm, 1*mm, fill=1, stroke=0)
    # Footer Line
    canvas.setStrokeColor(COLOR_BORDER)
    canvas.line(15*mm, 15*mm, 195*mm, 15*mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(COLOR_TEXT_LIGHT)
    canvas.drawString(15*mm, 10*mm, "Generated via Solar Admin Panel")
    canvas.drawRightString(195*mm, 10*mm, f"Page {doc.page}")
    canvas.restoreState()

def generate_solar_inspection_pdf(comparison_data: Dict[str, Any], inspection_details: Dict[str, Any] = None) -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, 
        pagesize=A4, 
        topMargin=25*mm, 
        bottomMargin=20*mm,
        leftMargin=15*mm,
        rightMargin=15*mm
    )
    
    elements = []
    style_sheet = getSampleStyleSheet()
    
    # --- Styles ---
    s_title = ParagraphStyle('Title', parent=style_sheet['Heading1'], fontName='Helvetica-Bold', fontSize=24, textColor=COLOR_SECONDARY, spaceAfter=8, spaceBefore=20)
    s_subtitle = ParagraphStyle('Subtitle', parent=style_sheet['Normal'], fontName='Helvetica', fontSize=12, textColor=COLOR_TEXT_LIGHT, spaceAfter=20)
    s_heading = ParagraphStyle('Heading', parent=style_sheet['Heading2'], fontName='Helvetica-Bold', fontSize=14, textColor=COLOR_PRIMARY, spaceBefore=20, spaceAfter=10)
    s_normal = ParagraphStyle('Normal', parent=style_sheet['Normal'], fontName='Helvetica', fontSize=10, textColor=COLOR_TEXT_MAIN, leading=14)
    s_value_large = ParagraphStyle('ValLarge', parent=style_sheet['Normal'], fontName='Helvetica-Bold', fontSize=18, textColor=COLOR_SECONDARY, alignment=TA_CENTER)
    s_value_label = ParagraphStyle('ValLabel', parent=style_sheet['Normal'], fontName='Helvetica', fontSize=9, textColor=COLOR_TEXT_LIGHT, alignment=TA_CENTER)
    
    # We only use REAL comparison data now
    summary = comparison_data.get('comparison_summary', {})
    reports = comparison_data.get('reports', [])
    
    # ============================================================================
    # 1. HEADER SECTION
    # ============================================================================
    elements.append(Paragraph("Inspection Comparison Report", s_title))
    gen_date = datetime.now().strftime("%B %d, %Y")
    report_count = comparison_data.get('total_reports', 0)
    elements.append(Paragraph(f"Analysis of {report_count} inspection files • Generated on {gen_date}", s_subtitle))
    elements.append(Spacer(1, 10))

    # ============================================================================
    # 2. KEY STATISTICS (KPI CARDS) - DYNAMIC DATA ONLY
    # ============================================================================
    # Using real data from 'comparison_summary'
    
    date_range = summary.get('date_range', {})
    oldest = date_range.get('oldest', 'N/A')
    newest = date_range.get('newest', 'N/A')
    
    # Format dates to be short
    def short_date(iso_str):
        if not iso_str or iso_str == 'N/A': return 'N/A'
        try:
            return iso_str[:10] # YYYY-MM-DD
        except:
            return iso_str

    kpi_data = [
        [
            Paragraph(str(summary.get('total_reports', 0)), s_value_large),
            Paragraph(f"{summary.get('total_size_mb', 0)} MB", s_value_large),
            Paragraph(format_file_size(summary.get('average_size_bytes', 0)), s_value_large),
            Paragraph(str(summary.get('unique_uploaders', 0)), s_value_large)
        ],
        [
            Paragraph("Total Reports", s_value_label),
            Paragraph("Total Size", s_value_label),
            Paragraph("Avg Size", s_value_label),
            Paragraph("Uploaders", s_value_label)
        ]
    ]

    card_width = 42*mm
    kpi_table = Table(kpi_data, colWidths=[card_width]*4)
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_BG_LIGHT),
        ('BOX', (0,0), (0,1), 0.5, COLOR_BORDER),
        ('BOX', (1,0), (1,1), 0.5, COLOR_BORDER),
        ('BOX', (2,0), (2,1), 0.5, COLOR_BORDER),
        ('BOX', (3,0), (3,1), 0.5, COLOR_BORDER),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,0), 12),
        ('BOTTOMPADDING', (0,1), (-1,1), 12),
    ]))
    elements.append(kpi_table)
    elements.append(Spacer(1, 20))

    # ============================================================================
    # 3. SCOPE OF WORK & ANALYSIS
    # ============================================================================
    elements.append(Paragraph("Scope of Work", s_heading))
    elements.append(Paragraph("A comprehensive thermal and visual inspection was conducted for a 5.8 MW solar installation in Punjab, India. The objective was to identify cellular-level hotspot anomalies, string-level electrical issues, and module-level physical defects.", s_normal))
    elements.append(Spacer(1, 15))

    # ============================================================================
    # 4. DETAILED COMPARATIVE FINDINGS (PERFORMANCE MATRIX)
    # ============================================================================
    elements.append(Paragraph("Comparative Defects Analysis", s_heading))
    elements.append(Paragraph("The following table consolidates anomalies from both inspections, merge-sorted by Row and Structure for spatial tracking.", s_normal))
    elements.append(Spacer(1, 10))

    # Prepare merged defect data from all reports
    merged_defects = []
    for report_idx, r in enumerate(reports):
        defects = r.get('solar_data', {}).get('defects_list', [])
        for d in defects:
            d_copy = d.copy()
            d_copy['source_report'] = f"R-{report_idx + 1}"
            merged_defects.append(d_copy)

    # Apply Merge Sort on the merged findings (Primary: Row, Secondary: Structure)
    sorted_defects = merge_sort_multiple_keys(merged_defects, [("row", False), ("structure", False)])

    # Create Table Headers (Matching the user's focus on Voltage Impact)
    finding_rows = [['S.NO', 'ROW', 'STRUCT', 'MODULE', 'SOURCE', 'VOLTS (V)', 'LOSS (%)', 'ANOMALY']]
    
    for idx, d in enumerate(sorted_defects, 1):
        anomaly_p = Paragraph(f"<b>{d.get('anomaly', 'N/A')}</b>", s_normal)
        actual_v = d.get('actual_v', 0.0)
        drop = d.get('voltage_drop', 0.0)
        
        # Color code voltage drop severity (use hex strings for font tags)
        drop_color_hex = '#ef4444' if drop > 50 else '#f97316'
        
        finding_rows.append([
            str(idx),
            str(d.get('row', '0')),
            str(d.get('structure', '0')),
            Paragraph(d.get('module', 'N/A'), ParagraphStyle('Module', parent=s_normal, fontSize=7)),
            Paragraph(f"<font color='#64748b'>{d.get('source_report')}</font>", s_normal),
            f"{actual_v}",
            Paragraph(f"<font color='{drop_color_hex}'>{drop}%</font>", s_normal),
            anomaly_p
        ])

    # Column widths S.NO(10), ROW(12), STRUCT(20), MOD(32), SRC(16), VOLT(22), LOSS(22), ANOM(46) = 180mm
    t_findings = Table(finding_rows, colWidths=[10*mm, 12*mm, 20*mm, 32*mm, 16*mm, 22*mm, 22*mm, 46*mm])
    
    t_findings.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_SECONDARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ('GRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,1), (2,-1), 'CENTER'), 
        ('ALIGN', (4,1), (6,-1), 'CENTER'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, COLOR_BG_LIGHT]),
        ('FONTSIZE', (0,1), (-1,-1), 9),
    ]))
    
    elements.append(t_findings)
    elements.append(Spacer(1, 20))

    # ============================================================================
    # 4. STORAGE & TIMELINE ANALYSIS
    # ============================================================================
    elements.append(Paragraph("Storage & Timeline Analysis", s_heading))
    
    # We will simply list them with a visual bar for size relative to the largest
    largest_size = max([r.get('file_size', 1) for r in reports]) if reports else 1
    
    analysis_rows = [['Report Name', 'Date', 'Size', 'Relative Size']]
    
    for r in reports:
        sz = r.get('file_size', 0)
        pct = (sz / largest_size) * 100
        # Create a simple ASCII-like bar or just text percent
        bar_char = "█" * int(pct/10)
        
        analysis_rows.append([
            Paragraph(r.get('filename', 'Unknown')[:30], s_normal),
            short_date(r.get('uploaded_at', '-')),
            format_file_size(sz),
            Paragraph(f"<font color='#3b82f6'>{bar_char}</font> {int(pct)}%", s_normal)
        ])
    
    t_analysis = Table(analysis_rows, colWidths=[70*mm, 30*mm, 25*mm, 55*mm])
    t_analysis.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_SECONDARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ('TOPPADDING', (0,0), (-1,0), 8),
        
        ('GRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, COLOR_BG_LIGHT]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    
    elements.append(t_analysis)
    
    # ============================================================================
    # 5. FOOTER & AUTHORITY
    # ============================================================================
    elements.append(Spacer(1, 15))
    elements.append(Paragraph("Inspection Authority", s_heading))
    
    authority_data = [
        [Paragraph("<b>Service Provider:</b> EagleAgro Drone Innovations Pvt Ltd", s_normal), 
         Paragraph("<b>Location:</b> Nagapattinam, India", s_normal)],
        [Paragraph("<b>Contact:</b> +91-9585299409", s_normal), 
         Paragraph("<b>Email:</b> info@eagleagro.com", s_normal)]
    ]
    
    t_authority = Table(authority_data, colWidths=[100*mm, 80*mm])
    t_authority.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t_authority)

    if not inspection_details:
        elements.append(Spacer(1, 15))
        note_style = ParagraphStyle('Note', parent=s_normal, fontSize=8, textColor=COLOR_TEXT_LIGHT, fontName='Helvetica-Oblique')
        elements.append(Paragraph("Note: This report compares file findings using advanced Merge Sort algorithms and deterministic data extraction. For precise physical rectification, refer to individual row-level thermal anomalies.", note_style))

    doc.build(elements, onFirstPage=draw_header, onLaterPages=draw_header)
    
    buffer.seek(0)
    return buffer
