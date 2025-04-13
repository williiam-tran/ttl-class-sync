import pdfplumber

with pdfplumber.open("cam16.pdf") as pdf:
    first_page = pdf.pages[0]
    print(first_page.chars[5])
