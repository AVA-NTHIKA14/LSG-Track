from pathlib import Path
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

OUT = Path(__file__).resolve().parents[1] / 'public' / 'user-guides'
OUT.mkdir(parents=True, exist_ok=True)

GUIDES = {
    'secretary-user-guide.pdf': ('Panchayat Secretary User Guide', [
        ('Daily overview', 'Open the Dashboard to review compliance, expiring licences, pending field reports and recent actions.'),
        ('Verify reports', 'Open Reports and review Ward Member submissions. Confirm the licence status, request inspection, or close duplicates.'),
        ('Manage registry', 'Use the Establishment Registry to review records and licence information. Keep every decision traceable.'),
        ('Reports', 'Generate the executive compliance report for committee review. Check the active panchayat before exporting.'),
        ('Security', 'Choose the Secretary role at sign-in. Never share credentials; use Sign out when leaving a shared device.')
    ]),
    'field-officer-user-guide.pdf': ('Field Officer User Guide', [
        ('Daily overview', 'Use your dashboard to identify data-entry and synchronisation work assigned to your panchayat.'),
        ('Registry', 'Add and correct establishment information only from authorised records. Confirm ward number, owner details and category before saving.'),
        ('Map review', 'Use the GIS map to check the placement of establishments. Escalate uncertain boundary issues to the Secretary.'),
        ('K-SMART sync', 'Import only official exports. Review the import summary and resolve failed records before reporting completion.'),
        ('Security', 'Choose Field Officer at sign-in. Your account cannot access secretary approvals or administration controls.')
    ]),
    'ward-member-user-guide.pdf': ('Ward Member User Guide', [
        ('Start work', 'Choose Ward Member at sign-in and confirm that your assigned ward is correct before submitting any record.'),
        ('Field survey', 'Use Field Survey to record a new observation. Enter the establishment, proprietor, category, ward and clear inspection remarks.'),
        ('Location and photo', 'Capture GPS and a clear onsite photograph when available. Do not upload unrelated images or personal documents.'),
        ('Submit', 'Review every field before sending. If connectivity is unavailable, save a draft and synchronise it when you are online.'),
        ('Follow-up', 'The Secretary verifies submitted reports. Correct or resubmit a report only when requested through the official workflow.')
    ])
}

def create(filename, title, sections):
    doc = SimpleDocTemplate(str(OUT / filename), pagesize=A4, leftMargin=20*mm, rightMargin=20*mm, topMargin=18*mm, bottomMargin=18*mm)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('guideTitle', parent=styles['Title'], textColor=HexColor('#0F6E4F'), fontSize=22, leading=27, spaceAfter=6)
    sub_style = ParagraphStyle('guideSub', parent=styles['Normal'], textColor=HexColor('#475569'), fontSize=10, leading=14, spaceAfter=16)
    h_style = ParagraphStyle('guideHeading', parent=styles['Heading2'], textColor=HexColor('#0F6E4F'), fontSize=13, leading=17, spaceBefore=9, spaceAfter=4)
    p_style = ParagraphStyle('guideBody', parent=styles['BodyText'], fontSize=10.5, leading=16, textColor=HexColor('#1E293B'))
    story = [Paragraph('LSG Track', ParagraphStyle('brand', parent=styles['Normal'], textColor=HexColor('#0F6E4F'), fontSize=10, leading=12)), Paragraph(title, title_style), Paragraph('Official operating guide - Local Self Government Department, Kerala', sub_style)]
    for number, (heading, body) in enumerate(sections, 1):
        story.extend([Paragraph(f'{number}. {heading}', h_style), Paragraph(body, p_style)])
    story.extend([Spacer(1, 14), Table([['Important', 'Use only your assigned role and dashboard. Contact the Panchayat Secretary for access or data issues.']], colWidths=[28*mm, 132*mm], style=TableStyle([('BACKGROUND',(0,0),(0,0),HexColor('#DCFCE7')),('BACKGROUND',(1,0),(1,0),HexColor('#F8FAFC')),('TEXTCOLOR',(0,0),(0,0),HexColor('#0F6E4F')),('FONTNAME',(0,0),(0,0),'Helvetica-Bold'),('GRID',(0,0),(-1,-1),0.5,HexColor('#BBF7D0')),('VALIGN',(0,0),(-1,-1),'TOP'),('PADDING',(0,0),(-1,-1),8)]))])
    doc.build(story)

for filename, (title, sections) in GUIDES.items():
    create(filename, title, sections)
    print(f'Created {filename}')
