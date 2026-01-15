import uuid
import io
import docx2txt
from pdfminer.high_level import extract_text as extract_pdf_text
from database import chunks_col


def extract_text(raw, filename):
    """Extract text from TXT, PDF, DOCX"""

    filename = filename.lower()

    if filename.endswith(".txt"):
        return raw.decode("utf-8", errors="ignore")

    if filename.endswith(".docx"):
        try:
            return docx2txt.process(io.BytesIO(raw))
        except Exception:
            return ""

    if filename.endswith(".pdf"):
        try:
            return extract_pdf_text(io.BytesIO(raw))
        except Exception:
            return ""

    # fallback
    return raw.decode("utf-8", errors="ignore")


def split_into_chunks(text, size=800):
    return [text[i:i + size] for i in range(0, len(text), size)]


import concurrent.futures

def process_chunk(chunk_data):
    """
    Helper function to process a single chunk.
    In a real-world scenario, complex NLP preprocessing could happen here.
    """
    return chunk_data

def save_chunks(text):
    """
    Splits text into chunks and saves them using parallel processing.
    Demonstrates usage of ThreadPoolExecutor for multi-tasking.
    """
    file_id = str(uuid.uuid4())
    chunks = split_into_chunks(text)
    
    documents = []
    chunk_ids = []

    # Prepare data for parallel execution
    tasks = []
    for index, chunk in enumerate(chunks, start=1):
        chunk_id = f"{file_id}_chunk_{index}"
        chunk_ids.append(chunk_id)
        tasks.append({
            "file_id": file_id,
            "chunk_id": chunk_id,
            "text": chunk
        })

    # Parallel Execution: Process chunks concurrently
    # This demonstrates the 'Text Breaker' module working in multi-tasking groups
    processed_docs = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        # Map the helper function to the data
        results = executor.map(process_chunk, tasks)
        processed_docs = list(results)

    # Batch Insert (Optimization)
    if processed_docs:
        chunks_col.insert_many(processed_docs)

    return {
        "file_id": file_id,
        "total_chunks": len(chunk_ids),
        "chunk_ids": chunk_ids
    }
