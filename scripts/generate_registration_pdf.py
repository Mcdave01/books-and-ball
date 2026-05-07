from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from pathlib import Path

output = Path('public/registration-form.pdf')
output.parent.mkdir(parents=True, exist_ok=True)

c = canvas.Canvas(str(output), pagesize=letter)
width, height = letter
margin = 0.75 * inch
x = margin
y = height - margin

c.setFont('Helvetica-Bold', 18)
c.drawString(x, y, 'BOOKS & BALL BASKETBALL ACADEMY')

c.setFont('Helvetica', 12)
y -= 24
c.drawString(x, y, 'Player Registration Form')

line_y = y - 14
c.line(x, line_y, width - margin, line_y)

section_gap = 28
field_gap = 18
label_font = 'Helvetica-Bold'
text_font = 'Helvetica'


def section(title):
    global y
    y -= section_gap
    c.setFont(label_font, 12)
    c.drawString(x, y, title)
    y -= 6
    c.setLineWidth(0.8)
    c.line(x, y, width - margin, y)
    y -= field_gap


def field(label, width_ratio=0.4, second_label=None, second_width_ratio=0.4):
    global y
    c.setFont(label_font, 11)
    c.drawString(x, y, label)
    c.setFont(text_font, 11)
    field_x = x + 150
    c.line(field_x, y - 2, field_x + (width - 2*margin)*width_ratio - 30, y - 2)
    if second_label:
        sec_x = x + 360
        c.setFont(label_font, 11)
        c.drawString(sec_x, y, second_label)
        c.setFont(text_font, 11)
        c.line(sec_x + 90, y - 2, sec_x + 90 + (width - 2*margin)*second_width_ratio - 40, y - 2)
    y -= field_gap


def multi_line(lines=2, width_percent=0.9):
    global y
    c.setFont(text_font, 11)
    for _ in range(lines):
        c.line(x, y - 2, x + (width - 2*margin)*width_percent, y - 2)
        y -= field_gap

section('PERSONAL INFORMATION')
field('First Name:', 0.28, 'Last Name:', 0.28)
field('Date of Birth (MM/DD/YYYY):', 0.22, 'Grade:', 0.14)

c.setFont(label_font, 11)
c.drawString(x, y, 'Preferred Position:')
pos_x = x + 140
positions = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center']
for i, pos in enumerate(positions):
    c.setFont(text_font, 11)
    c.drawString(pos_x, y, f'___ {pos}')
    pos_x += 130
    if i == 1:
        y -= field_gap
        pos_x = x + 140

y -= field_gap

section('PHYSICAL INFORMATION')
field('Height:', 0.18, 'Weight:', 0.18)
field('Jersey Size:', 0.10)
size_x = x + 140
sizes = ['S', 'M', 'L', 'XL']
for size in sizes:
    c.drawString(size_x, y + field_gap, f'___ {size}')
    size_x += 70

section('CONTACT INFORMATION')
field('School:', 0.70)
field('Home Phone:', 0.28, 'Email:', 0.40)

section('EMERGENCY CONTACT INFORMATION')
field('Name:', 0.70)
field('Relationship:', 0.28, 'Phone:', 0.35)
field('Alternate Phone:', 0.65)

section('MEDICAL INFORMATION')

c.setFont(label_font, 11)
c.drawString(x, y, 'Medical Conditions/Allergies/Medications:')
y -= 14
for _ in range(3):
    c.line(x, y, width - margin, y)
    y -= field_gap

field('Insurance Provider:', 0.35, 'Policy #:', 0.40)

section('BASKETBALL EXPERIENCE')

c.setFont(label_font, 11)
c.drawString(x, y, 'Previous Experience/Teams/Achievements:')
y -= 14
for _ in range(4):
    c.line(x, y, width - margin, y)
    y -= field_gap

c.setFont(label_font, 11)
c.drawString(x, y, 'Goals and Expectations:')
y -= 14
for _ in range(3):
    c.line(x, y, width - margin, y)
    y -= field_gap

section('PARENT/GUARDIAN AGREEMENT')

c.setFont(text_font, 10)
lines = [
    'I give permission for my child to participate in all Books & Ball Basketball Academy',
    'activities, including practices, games, and travel. I understand that participation',
    'involves risks and I assume all such risks.',
    '',
    'I agree to pay all fees and charges associated with my child\'s participation. I',
    'understand that fees are non-refundable except as specified in the academy\'s policies.',
    '',
    'I certify that the information provided above is true and complete. I understand',
    'that providing false information may result in termination of participation.',
]
for line in lines:
    c.drawString(x, y, line)
    y -= 14

field('Parent/Guardian Signature:', 0.50, 'Date:', 0.20)
field('Print Name:', 0.70)

y -= 10
c.setFont('Helvetica-Bold', 11)
c.drawString(x, y, 'Books & Ball Basketball Academy')
y -= 14
c.setFont(text_font, 10)
c.drawString(x, y, '123 Basketball Court, Sports City, Satdium Osogbo, Osun state')
y -= 12
c.drawString(x, y, 'Phone: (+234) 7035 655 588 | Email: info@booksandball.com')
y -= 22
field('Form completed on:', 0.35)

c.showPage()
c.save()
print(f'Created {output}')
