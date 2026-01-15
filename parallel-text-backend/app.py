from fastapi import FastAPI, UploadFile, File, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from database import get_chunk_by_id, save_score, search_chunks, get_chunks_with_scores, register_user, login_user
from rule_checker import analyze
import chunker   # <-- import the module, not only a function
from fastapi.responses import StreamingResponse
import csv
import io
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os
import asyncio  # For async parallel processing
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# FIX: Windows specific event loop policy to prevent "RuntimeError: Event loop is closed"
import sys
if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

app = FastAPI()

# ----------------------------
# CORS SETTINGS
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# AUTH ENDPOINTS
# ----------------------------
@app.post("/register")
def register(response: Response, email: str = Form(...), password: str = Form(...), name: str = Form(...)):
    result = register_user(email, password, name)
    if "error" in result:
        response.status_code = 400
    return result

@app.post("/login")
def login(response: Response, email: str = Form(...), password: str = Form(...)):
    result = login_user(email, password)
    if "error" in result:
        response.status_code = 401
    return result

# ----------------------------
# FILE UPLOAD + CHUNKING
# ----------------------------
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename.lower()
    raw = await file.read()

    # call module functions
    # ⚡ Run CPU-bound tasks (Text Extraction + Chunking) in a separate thread
    # This prevents blocking the main event loop, allowing true parallel request handling.
    loop = asyncio.get_running_loop()

    try:
        # Offload text extraction
        text = await loop.run_in_executor(None, chunker.extract_text, raw, filename)
        
        if not text or not text.strip():
             print(f"DEBUG: Extracted text is empty for file: {filename}")
             return {"error": "Could not extract text from file"}
             
        print(f"DEBUG: Extraction successful. Length: {len(text)} chars. Snippet: {text[:50]}...")
        # Offload chunking and saving
        result = await loop.run_in_executor(None, chunker.save_chunks, text)
    except Exception as e:
        print(f"DEBUG: Extraction failed: {e}")
        return {"error": f"Processing failed: {str(e)}"}

    return {
        "message": "File uploaded and chunked successfully",
        "file_id": result["file_id"],
        "total_chunks": result["total_chunks"],
        "chunk_ids": result["chunk_ids"]
    }

# ----------------------------
# ANALYZE A SINGLE CHUNK
# ----------------------------
@app.get("/analyze/{chunk_id}")
async def analyze_chunk(chunk_id: str):
    chunk = get_chunk_by_id(chunk_id)

    if not chunk:
        return {"error": "Chunk not found"}

    text = chunk["text"]
    
    # ⚡ Run Rule-Checker in parallel (non-blocking)
    # This fulfills the requirement: "Run scoring in parallel"
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(None, analyze, text)
    
    print(f"DEBUG: Analyzing chunk {chunk_id}. Score: {result.get('score')}. Matches: {result.get('matches')}")

    output = {
        "chunk_id": chunk_id,
        "matches": result.get("matches", {}),
        # frontend expects a flattened list sometimes — include both
        "patterns": result.get("flat_patterns", []),
        "score": result.get("score", 0)
    }

    save_score(output)
    return output


# ----------------------------
# SEARCH
# ----------------------------
@app.get("/search")
def search(q: str = None, file_id: str = None, limit: int = 20):
    """Search chunks for a query. Returns top matching chunks with scores."""
    if not q or not q.strip():
        return {"error": "Query parameter 'q' is required"}

    limit = max(1, min(200, limit))
    results = search_chunks(q, file_id=file_id, limit=limit)

    # trim text for response to keep payload small
    trimmed = []
    for r in results:
        text = r.get("text", "")
        snippet = text if len(text) <= 800 else text[:800] + "..."
        trimmed.append({
            "chunk_id": r.get("chunk_id"),
            "score": r.get("score", 0),
            "snippet": snippet
        })

    return {"query": q, "file_id": file_id, "results": trimmed, "count": len(trimmed)}

# ----------------------------
# CSV EXPORT
# ----------------------------
@app.get("/export")
def export_csv(file_id: str):
    """Export all chunks for a file_id as CSV (chunk_id, text, score, matches, patterns)."""
    if not file_id:
        return {"error": "file_id parameter is required"}

    data = get_chunks_with_scores(file_id)
    if not data:
        return {"error": "No chunks found for this file_id"}

    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow(["chunk_id", "text", "score", "matches", "patterns"])

    # Rows
    for row in data:
        writer.writerow([
            row["chunk_id"],
            row["text"],
            row["score"],
            str(row["matches"]),  # dict as string
            str(row["patterns"])  # list as string
        ])

    output.seek(0)

    # Return as streaming response
    def iter_csv():
        yield output.getvalue()

    return StreamingResponse(
        iter_csv(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={file_id}_chunks.csv"}
    )


# ----------------------------
# EMAIL SUMMARY
# ----------------------------
@app.get("/email_summary")
def email_summary(file_id: str, to_email: str):
    """Send email with CSV summary for a file_id."""
    if not file_id or not to_email:
        return {"error": "file_id and to_email are required"}

    data = get_chunks_with_scores(file_id)
    if not data:
        return {"error": "No chunks found for this file_id"}

    # Generate summary text
    total_chunks = len(data)
    avg_score = sum(float(d["score"]) for d in data) / total_chunks if total_chunks else 0
    chunks_with_matches = sum(1 for d in data if d["matches"] and d["matches"] != {})
    summary_text = f"""
Text Processing Summary for File ID: {file_id}

Total Chunks: {total_chunks}
Average Score: {avg_score:.2f}
Chunks with Detected Patterns: {chunks_with_matches}

Attached: Full CSV export of all chunks.
"""

    # Generate CSV attachment
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["chunk_id", "text", "score", "matches", "patterns"])
    for row in data:
        writer.writerow([
            row["chunk_id"],
            row["text"],
            row["score"],
            str(row["matches"]),
            str(row["patterns"])
        ])
    output.seek(0)
    csv_content = output.getvalue()

    # Email settings from env or defaults
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "your_email@gmail.com")
    smtp_pass = os.getenv("SMTP_PASS", "your_password")
    from_addr = os.getenv("FROM_ADDR", smtp_user)

    # Create message
    msg = MIMEMultipart()
    msg['From'] = from_addr
    msg['To'] = to_email
    msg['Subject'] = f"Text Processing Summary - {file_id}"

    msg.attach(MIMEText(summary_text, 'plain'))

    # Attach CSV
    part = MIMEBase('application', 'octet-stream')
    part.set_payload(csv_content)
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', f'attachment; filename={file_id}_chunks.csv')
    msg.attach(part)

    # Send email
    try:
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        text = msg.as_string()
        server.sendmail(from_addr, to_email, text)
        server.quit()
        print(f"Email sent successfully to {to_email}")
        return {"message": f"Summary email sent to {to_email}"}
    except Exception as e:
        print(f"Email send error: {str(e)}")
        # Return 500 error so frontend knows it failed
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=500, content={"error": f"Failed to send email: {str(e)}"})


# ----------------------------
# health-check
# ----------------------------
@app.get("/")
def root():
    return {"message": "Backend running"}