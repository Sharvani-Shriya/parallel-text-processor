import os
from dotenv import load_dotenv
from pymongo import MongoClient
import bcrypt

load_dotenv()

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGODB_URI")
if not MONGO_URI:
    raise ValueError("MONGODB_URI is not set in the environment variables")
client = MongoClient(MONGO_URI)

# Database
db = client["parallel_text_processor"]

# Collections
chunks_col = db["chunks"]
scores_col = db["scores"]
users_col = db["users"]

# Create Indexes (Optimization for Search & Retrieval)
# Ensure fast lookups by file_id and text content
chunks_col.create_index([("file_id", 1)])
chunks_col.create_index([("text", "text")])  # Text index for search

# Ensure fast lookups by chunk_id and sorting by score
scores_col.create_index([("chunk_id", 1)])
scores_col.create_index([("score", -1)])
users_col.create_index([("email", 1)], unique=True)


def get_chunk_by_id(chunk_id: str):
    """Fetch a chunk by its ID"""
    return chunks_col.find_one({"chunk_id": chunk_id})

def save_score(result: dict):
    """Save or update the score result for a chunk"""
    scores_col.update_one(
        {"chunk_id": result["chunk_id"]},
        {"$set": result},
        upsert=True
    )


def get_chunks_with_scores(file_id: str):
    """Get all chunks for a file_id, joined with their scores if available.

    Returns list of dicts: {chunk_id, text, score, matches, patterns}
    """
    # Fetch chunks
    chunks = list(chunks_col.find({"file_id": file_id}, {"chunk_id": 1, "text": 1}))

    # Fetch scores
    chunk_ids = [c["chunk_id"] for c in chunks]
    scores = {s["chunk_id"]: s for s in scores_col.find({"chunk_id": {"$in": chunk_ids}})}

    # Join
    results = []
    for chunk in chunks:
        cid = chunk["chunk_id"]
        score_doc = scores.get(cid, {})
        results.append({
            "chunk_id": cid,
            "text": chunk.get("text", ""),
            "score": score_doc.get("score", 0),
            "matches": score_doc.get("matches", {}),
            "patterns": score_doc.get("patterns", [])
        })

    return results


def search_chunks(query: str, file_id: str = None, limit: int = 50):
    """Search chunks by a simple token-overlap scoring.

    Returns a list of dicts: {chunk_id, text, score}
    """
    if not query:
        return []

    q = query.lower().strip()
    tokens = [t for t in q.split() if t]

    # Build Mongo filter
    filt = {}
    if file_id:
        filt["file_id"] = file_id

    # Use a case-insensitive regex search for the full query as a starting filter
    filt["text"] = {"$regex": q, "$options": "i"}

    cursor = chunks_col.find(filt, {"chunk_id": 1, "text": 1}).limit(limit)

    results = []
    for doc in cursor:
        text = doc.get("text", "")
        lower = text.lower()

        # simple token overlap score: matching tokens / total query tokens
        matches = 0
        for t in tokens:
            if t in lower:
                matches += 1

        score = matches / len(tokens) if tokens else 0

        results.append({
            "chunk_id": doc.get("chunk_id"),
            "text": text,
            "score": score
        })

    # sort by score desc
    results.sort(key=lambda r: r.get("score", 0), reverse=True)
    return results


def register_user(email: str, password: str, name: str):
    """Register a new user. Returns success or error."""
    if users_col.find_one({"email": email}):
        return {"error": "User already exists"}
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    users_col.insert_one({"email": email, "password": hashed.decode('utf-8'), "name": name})
    return {"message": "User registered successfully"}


def login_user(email: str, password: str):
    """Login user. Returns user data or error."""
    user = users_col.find_one({"email": email})
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
        return {"error": "Invalid credentials"}
    return {"message": "Login successful", "user": {"email": user["email"], "name": user["name"]}}
