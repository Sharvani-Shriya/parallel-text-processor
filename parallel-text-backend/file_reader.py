import io
import pandas as pd
from PyPDF2 import PdfReader
from docx import Document
from PIL import Image
import pytesseract

# Set Tesseract path (update if needed)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def extract_text_from_file(file: bytes, filename: str) -> str:
    ext = filename.split(".")[-1].lower()

    # --------------------------------------
    # PDF
    # --------------------------------------
    if ext == "pdf":
        reader = PdfReader(io.BytesIO(file))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text

    # --------------------------------------
    # DOCX
    # --------------------------------------
    if ext == "docx":
        doc = Document(io.BytesIO(file))
        return "\n".join([p.text for p in doc.paragraphs])

    # --------------------------------------
    # CSV
    # --------------------------------------
    if ext == "csv":
        df = pd.read_csv(io.BytesIO(file))
        return df.to_string()

    # --------------------------------------
    # TEXT FILE
    # --------------------------------------
    if ext in ["txt"]:
        return file.decode("utf-8", errors="ignore")

    # --------------------------------------
    # IMAGE (OCR)
    # --------------------------------------
    if ext in ["png", "jpg", "jpeg"]:
        image = Image.open(io.BytesIO(file))
        return pytesseract.image_to_string(image)

    # --------------------------------------
    # UNKNOWN → decode best effort
    # --------------------------------------
    try:
        return file.decode("utf-8", errors="ignore")
    except:
        return ""
