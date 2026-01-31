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

# --- Color Palette ---
COLOR_PRIMARY = colors.HexColor('#f97316')  # Orange-500
COLOR_SECONDARY = colors.HexColor('#0f172a')  # Slate-900
COLOR_ACCENT = colors.HexColor('#3b82f6')     # Blue-500
COLOR_BG_LIGHT = colors.HexColor('#f8fafc')   # Slate-50
COLOR_BORDER = colors.HexColor('#e2e8f0')     # Slate-200
COLOR_TEXT_MAIN = colors.HexColor('#334155')  # Slate-700
COLOR_TEXT_LIGHT = colors.HexColor('#64748b') # Slate-500
COLOR_SUCCESS = colors.HexColor('#22c55e') # Green

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
    # 3. COMPARISON MATRIX (Dynamic Solar Data)
    # ============================================================================
    # Show side-by-side comparison of up to 3 files, or list view if more.
    
    elements.append(Paragraph("Solar Performance Analysis", s_heading))

    if len(reports) <= 4: # Increased to 4 side-by-side
        # SIDE-BY-SIDE VIEW
        header_row = ['METRIC'] + [f"Report {i+1}" for i in range(len(reports))]
        
        # Helper to get solar data safely
        def get_solar(r, key, suffix=''):
            val = r.get('solar_data', {}).get(key, '-')
            return f"{val}{suffix}" if val != '-' else '-'

        # Define Rows
        filenames = ['Filename'] + [r.get('filename', '-')[:15] + '...' for r in reports]
        
        # solar metrics
        row_eff = ['Efficiency'] + [get_solar(r, 'efficiency', '%') for r in reports]
        row_pwr = ['Power Output'] + [get_solar(r, 'power', ' kW') for r in reports]
        row_temp = ['Avg Temp'] + [get_solar(r, 'temp', '°C') for r in reports]
        
        # Defect metrics
        row_hot = ['Hotspots'] + [get_solar(r, 'hotspots') for r in reports]
        row_crk = ['Micro-cracks'] + [get_solar(r, 'cracks') for r in reports]
        row_soil = ['Soiling'] + [get_solar(r, 'soiling') for r in reports]
        row_crit = ['Critical Defects'] + [get_solar(r, 'defects_critical') for r in reports]
        
        matrix_data = [header_row, filenames, row_eff, row_pwr, row_temp, row_hot, row_crk, row_soil, row_crit]
        
        # Calculate optimal column width
        col_w = (140 / len(reports)) * mm
        col_widths = [40*mm] + [col_w] * len(reports)
        
        t_matrix = Table(matrix_data, colWidths=col_widths)
        t_matrix.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), COLOR_SECONDARY),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,0), 9),
            ('BOTTOMPADDING', (0,0), (-1,0), 8),
            ('TOPPADDING', (0,0), (-1,0), 8),
            
            ('BACKGROUND', (0,1), (0,-1), COLOR_BG_LIGHT), # First col bg
            ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'), # First col bold
            
            ('GRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
            ('ALIGN', (1,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('PADDING', (0,0), (-1,-1), 8),
            
            # Highlight Defect Rows (Hotspots, Critical)
            ('TEXTCOLOR', (0, 5), (-1, 5), COLOR_DANGER), # Hotspots row
            ('TEXTCOLOR', (0, 8), (-1, 8), COLOR_DANGER), # Critical row
            ('FONTNAME', (0, 8), (-1, 8), 'Helvetica-Bold'),
        ]))
        elements.append(t_matrix)
    else:
        # LIST VIEW for >4 reports
        elements.append(Paragraph(f"Analysis of {len(reports)} files (Matrix view limited to 4)", s_normal))
        
        # Create a detailed list table for many reports
        rows = [['Report Name', 'Efficiency', 'Power', 'Hotspots', 'Critical']]
        for r in reports:
            sd = r.get('solar_data', {})
            rows.append([
                r.get('filename', '-')[:25],
                f"{sd.get('efficiency', '-')}%",
                f"{sd.get('power', '-')} kW",
                sd.get('hotspots', '-'),
                sd.get('defects_critical', '-')
            ])
            
        t_list = Table(rows, colWidths=[60*mm, 30*mm, 30*mm, 30*mm, 30*mm])
        t_list.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), COLOR_SECONDARY),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('GRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, COLOR_BG_LIGHT]),
        ]))
        elements.append(t_list)

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
    # 5. FOOTER NOTE
    # ============================================================================
    if not inspection_details:
        elements.append(Spacer(1, 15))
        note_style = ParagraphStyle('Note', parent=s_normal, fontSize=8, textColor=COLOR_TEXT_LIGHT, fontName='Helvetica-Oblique')
        elements.append(Paragraph("Note: This report compares file metadata only. Content analysis requires specific OCR processing.", note_style))

    doc.build(elements, onFirstPage=draw_header, onLaterPages=draw_header)
    
    buffer.seek(0)
    return buffer
