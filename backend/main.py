from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.ml import classify_post
from backend.ai import generate_posts

# ---------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------

app = FastAPI(
    title="LinkedAI API",
    description="AI-powered LinkedIn post generator",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Request model
# ---------------------------------------------------------

class GenerateRequest(BaseModel):
    text: str
    tone: str = "Professional"
    number_of_drafts: int = 3


# ---------------------------------------------------------
# Health check
# ---------------------------------------------------------

@app.get("/api")
def root():
    return {
        "message": "LinkedAI API is running"
    }


# ---------------------------------------------------------
# Generate LinkedIn posts
# ---------------------------------------------------------

@app.post("/api/generate")
def generate(request: GenerateRequest):

    # Step 1: Classify the original post
    classification = classify_post(request.text)

    # Step 2: Generate LinkedIn drafts
    drafts = generate_posts(
        original_text=request.text,
        category=classification["category"],
        tone=request.tone,
        number_of_drafts=request.number_of_drafts,
    )

    return {
        "category": classification["category"],
        "confidence": classification["confidence"],
        "confidence_level": classification.get(
            "confidence_level"
        ),
        "needs_review": classification.get(
            "needs_review"
        ),
        "alternative_category": classification.get(
            "alternative_category"
        ),
        "drafts": drafts,
    }