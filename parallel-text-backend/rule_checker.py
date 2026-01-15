import re

RULES = {
    # IDENTITY
    "email": (r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", 8),
    "mobile": (r"\b[6-9]\d{9}\b", 8),

    # DATES & NUMBERS
    "date": (r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b", 4),
    "amount": (r"\b(rs\.?|₹|\$)\s?\d+(\.\d+)?\b", 4),

    # ACTION / INTENT
    "request": (r"\b(request|apply|submit|require|need)\b", 3),
    "complaint": (r"\b(issue|problem|complaint|delay|error|fail)\b", 3),
    "urgent": (r"\b(urgent|immediate|asap|important)\b", 4),

    # WORK / TECH
    "technology": (
        r"\b(software|application|system|server|database|network)\b",
        3
    ),

    # EDUCATION / SKILLS (still valid)
    "skills": (
        r"\b(python|java|c\+\+|html|css|javascript|sql|react|node|ai|ml)\b",
        2
    ),

    # SENTIMENT (simple)
    "positive": (r"\b(good|satisfied|happy|excellent)\b", 1),
    "negative": (r"\b(bad|unsatisfied|poor|delay|angry)\b", 1),
}

# -------------------------------------------------------------
# RULE CHECKER & SCORER MODULE
# -------------------------------------------------------------
# This module implements rule-based text analysis.
# usage: It scans text for defined regex patterns and calculates a score.
#
# Scoring Logic:
# - Matches found are weighted based on importance.
# - High priority (e.g., identity, urgent) = Higher weights
# - Low priority (e.g., sentiment keywords) = Lower weights

def analyze(text: str):
    """
    Analyzes the input text against predefined Regex rules.
    
    Args:
        text (str): The chunk text to analyze.
        
    Returns:
        dict: Contains 'matches' (patterns found), 'flat_patterns' (list), and 'score' (int).
    """
    text = text.lower()
    matches = {}
    flat_patterns = []
    score = 0

    # Iterate through rules and apply regex matching
    for name, (pattern, weight) in RULES.items():
        found = re.findall(pattern, text, flags=re.IGNORECASE)
        if found:
            unique = list(set(found))
            matches[name] = unique
            flat_patterns.extend(unique)
            # Weighted scoring: count * weight
            score += len(unique) * weight
        else:
            matches[name] = []

    # Baseline score: if text is substantial but no patterns found, give it a base score
    if score == 0 and len(text.strip()) > 30:
        score = 5

    return {
        "matches": matches,
        "flat_patterns": flat_patterns,
        "score": score
    }
