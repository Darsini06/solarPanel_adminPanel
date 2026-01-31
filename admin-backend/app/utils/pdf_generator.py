"""
PDF Report Generator for Comparison Reports
Generates a single merged PDF containing comparison data
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from io import BytesIO
from datetime import datetime
from typing import List, Dict, Any


def format_file_size(bytes_size):
    """Format bytes to human readable size"""
    if not bytes_size:
        return '0 Bytes'
    k = 1024
    sizes = ['Bytes', 'KB', 'MB', 'GB']
    i = 0
    size = float(bytes_size)
    while size >= k and i < len(sizes) - 1:
        size /= k
        i += 1
    return f"{size:.2f} {sizes[i]}"


def generate_comparison_pdf(comparison_data: Dict[str, Any]) -> BytesIO:
    """
    Generate a PDF report from comparison data.
    
    Args:
        comparison_data: Dictionary containing comparison results
    
    Returns:
        BytesIO object containing the PDF
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    # Container for PDF elements
    elements = []
    
    # Styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    subheading_style = ParagraphStyle(
        'CustomSubHeading',
        parent=styles['Heading3'],
        fontSize=12,
        textColor=colors.HexColor('#475569'),
        spaceAfter=8,
        fontName='Helvetica-Bold'
    )
    
    normal_style = styles['Normal']
    
    # Title
    elements.append(Paragraph("📊 Report Comparison Analysis", title_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Generation Info
    gen_time = datetime.now().strftime("%B %d, %Y at %I:%M %p")
    elements.append(Paragraph(f"<i>Generated on: {gen_time}</i>", normal_style))
    elements.append(Paragraph(f"<i>Algorithm Used: {comparison_data.get('algorithm_used', 'Merge Sort - O(n log n)')}</i>", normal_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # Summary Statistics
    elements.append(Paragraph("Summary Statistics", heading_style))
    
    summary = comparison_data.get('comparison_summary', {})
    
    summary_data = [
        ['Metric', 'Value'],
        ['Total Reports Compared', str(summary.get('total_reports', 0))],
        ['Total Size', f"{summary.get('total_size_mb', 0)} MB"],
        ['Average Report Size', format_file_size(summary.get('average_size_bytes', 0))],
        ['Unique Uploaders', str(summary.get('unique_uploaders', 0))],
    ]
    
    summary_table = Table(summary_data, colWidths=[3*inch, 3*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f1f5f9')]),
    ]))
    
    elements.append(summary_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Size Analysis
    elements.append(Paragraph("Size Analysis", heading_style))
    
    smallest = summary.get('smallest_report', {})
    largest = summary.get('largest_report', {})
    
    size_data = [
        ['Category', 'Filename', 'Size'],
        ['Smallest Report', smallest.get('filename', 'N/A'), format_file_size(smallest.get('size', 0))],
        ['Largest Report', largest.get('filename', 'N/A'), format_file_size(largest.get('size', 0))],
    ]
    
    size_table = Table(size_data, colWidths=[1.5*inch, 3*inch, 1.5*inch])
    size_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8b5cf6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f1f5f9')]),
    ]))
    
    elements.append(size_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Detailed Reports List
    elements.append(Paragraph(f"Detailed Report List (Sorted by {comparison_data.get('sorted_by', 'date')})", heading_style))
    elements.append(Spacer(1, 0.1*inch))
    
    reports = comparison_data.get('reports', [])
    
    # Create table data
    report_data = [['#', 'Filename', 'Size', 'Uploaded At', 'Uploaded By']]
    
    for idx, report in enumerate(reports, 1):
        uploaded_at = report.get('uploaded_at', '')
        if uploaded_at:
            try:
                dt = datetime.fromisoformat(uploaded_at.replace('Z', '+00:00'))
                uploaded_at = dt.strftime("%Y-%m-%d %H:%M")
            except:
                pass
        
        report_data.append([
            str(idx),
            report.get('filename', 'Unknown')[:40],  # Truncate long names
            format_file_size(report.get('file_size', 0)),
            uploaded_at,
            report.get('uploaded_by', {}).get('user_name', 'Unknown')[:20]
        ])
    
    # Create table with appropriate column widths
    col_widths = [0.4*inch, 2.5*inch, 1*inch, 1.5*inch, 1.2*inch]
    report_table = Table(report_data, colWidths=col_widths, repeatRows=1)
    
    report_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#10b981')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),  # Center align index column
        ('ALIGN', (1, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f1f5f9')]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    elements.append(report_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Footer
    elements.append(Spacer(1, 0.5*inch))
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.grey,
        alignment=TA_CENTER
    )
    elements.append(Paragraph("This report was automatically generated by Solar Panel Inspection System", footer_style))
    elements.append(Paragraph(f"Using {comparison_data.get('algorithm_used', 'Merge Sort Algorithm')} for optimal performance", footer_style))
    
    # Build PDF
    doc.build(elements)
    
    buffer.seek(0)
    return buffer


def generate_simple_comparison_pdf(reports: List[Dict[str, Any]], title: str = "Report Comparison") -> BytesIO:
    """
    Generate a simple comparison PDF when full comparison data is not available.
    
    Args:
        reports: List of report dictionaries
        title: Title for the PDF
    
    Returns:
        BytesIO object containing the PDF
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Title
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=colors.HexColor('#1e40af'),
        alignment=TA_CENTER
    )
    elements.append(Paragraph(title, title_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # Reports table
    data = [['#', 'Filename', 'Size', 'Uploaded At']]
    
    for idx, report in enumerate(reports, 1):
        data.append([
            str(idx),
            report.get('filename', 'Unknown'),
            format_file_size(report.get('file_size', 0)),
            report.get('uploaded_at', 'Unknown')
        ])
    
    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    
    elements.append(table)
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
