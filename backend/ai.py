import os
import json
import re

from dotenv import load_dotenv
from openai import OpenAI


# =========================================================
# Environment
# =========================================================

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "OPENROUTER_API_KEY environment variable is not set."
    )


# =========================================================
# OpenRouter client
# =========================================================

client = OpenAI(
    api_key=API_KEY,
    base_url="https://openrouter.ai/api/v1",
)


# =========================================================
# Supported categories
# =========================================================

SUPPORTED_CATEGORIES = {
    "PROJECT",
    "CAREER",
    "ACHIEVEMENT",
    "CERTIFICATION",
    "LEARNING",
    "EDUCATIONAL",
}


# =========================================================
# Supported tones
# =========================================================

SUPPORTED_TONES = {
    "Professional",
    "Casual",
    "Inspirational",
    "Technical",
}


# =========================================================
# Simple grounding validation
# =========================================================

def validate_grounding(original_text, generated_text):
    """
    Detect obvious unsupported factual claims.

    This is intentionally simple.
    It is not a full fact-checking system.
    """

    warnings = []

    original_lower = original_text.lower()
    draft_lower = generated_text.lower()

    # -----------------------------------------------------
    # Check percentages
    # -----------------------------------------------------

    draft_percentages = re.findall(
        r"\b\d+(?:\.\d+)?\s*%",
        draft_lower
    )

    original_percentages = re.findall(
        r"\b\d+(?:\.\d+)?\s*%",
        original_lower
    )

    if draft_percentages and not original_percentages:
        warnings.append(
            "Draft contains an unsupported percentage."
        )

    # -----------------------------------------------------
    # Check numerical claims
    # -----------------------------------------------------

    draft_numbers = re.findall(
        r"\b\d+(?:\.\d+)?\b",
        draft_lower
    )

    original_numbers = re.findall(
        r"\b\d+(?:\.\d+)?\b",
        original_lower
    )

    unsupported_numbers = [
        number
        for number in draft_numbers
        if number not in original_numbers
    ]

    if unsupported_numbers:
        warnings.append(
            "Draft contains unsupported numerical claims."
        )

    # -----------------------------------------------------
    # Check obvious achievement claims
    # -----------------------------------------------------

    risky_patterns = [
        r"\bwon\b",
        r"\bwinning\b",
        r"\bfirst place\b",
        r"\btop position\b",
        r"\bawarded\b",
        r"\breceived\b",
        r"\bpromoted\b",
        r"\bled a team\b",
        r"\bmanaged a team\b",
        r"\bmonths?\b",
        r"\byears?\b",
        r"\bclients?\b",
        r"\busers?\b",
        r"\bemployees?\b",
    ]

    for pattern in risky_patterns:

        if re.search(pattern, draft_lower):

            if not re.search(pattern, original_lower):
                warnings.append(
                    f"Unsupported personal claim detected: {pattern}"
                )

    return {
        "is_grounded": len(warnings) == 0,
        "warnings": warnings,
    }


# =========================================================
# Generate LinkedIn posts
# =========================================================

def generate_posts(
    original_text,
    category,
    tone="Professional",
    number_of_drafts=3,
):
    """
    Generate LinkedIn post drafts using OpenRouter.
    """

    # -----------------------------------------------------
    # Validate input
    # -----------------------------------------------------

    if not original_text or not original_text.strip():
        raise ValueError(
            "Original post text cannot be empty."
        )

    if category not in SUPPORTED_CATEGORIES:
        raise ValueError(
            f"Unsupported category: {category}"
        )

    if tone not in SUPPORTED_TONES:
        raise ValueError(
            f"Unsupported tone: {tone}"
        )

    number_of_drafts = max(
        1,
        min(number_of_drafts, 5)
    )

    # -----------------------------------------------------
    # Prompt
    # -----------------------------------------------------

    prompt = f"""
You are an expert LinkedIn content writer.

Generate {number_of_drafts} distinct LinkedIn post drafts.

ORIGINAL POST:
{original_text}

PREDICTED CATEGORY:
{category}

REQUESTED TONE:
{tone}

CATEGORY GUIDANCE:

PROJECT:
Focus on what was built, technologies used,
implementation details, and lessons learned.

CAREER:
Focus on career milestones, opportunities,
professional growth, and future direction.

ACHIEVEMENT:
Focus on the accomplishment, challenge,
result, recognition, and contribution.

CERTIFICATION:
Focus on the certification, skills covered,
key takeaways, and practical application.

LEARNING:
Focus on a personal learning experience,
discovery, lesson, mistake, or insight.

EDUCATIONAL:
Explain a useful concept clearly so another
student or professional can understand it.

WRITING REQUIREMENTS:

1. Make every draft meaningfully different.
2. Use only facts explicitly stated in the ORIGINAL POST.
3. Never invent companies, employers, awards,
   certifications, technologies, numbers,
   percentages, results, experiences, or achievements.
4. Do not assume details that are not provided.
5. You may improve wording, structure, and readability,
   but do not change the factual meaning.
6. Keep the writing natural and human.
7. Avoid excessive corporate buzzwords.
8. Use short paragraphs.
9. Start with an engaging opening.
10. Use hashtags sparingly.
11. Do not mention AI generation.
12. Return ONLY valid JSON.

Your entire response MUST be a valid JSON object.

Do NOT include:
- explanations
- safety notes
- markdown
- markdown code fences
- text before the JSON
- text after the JSON

Use exactly this structure:

{{
    "drafts": [
        {{
            "content": "LinkedIn post..."
        }}
    ]
}}
"""

    # -----------------------------------------------------
    # OpenRouter request
    # -----------------------------------------------------

    response = client.chat.completions.create(
        model="openrouter/free",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a professional LinkedIn "
                    "content writer. Return ONLY valid JSON. "
                    "Never invent facts."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.7,
    )

    # -----------------------------------------------------
    # Extract response
    # -----------------------------------------------------

    output_text = response.choices[0].message.content

    if not output_text:
        raise RuntimeError(
            "OpenRouter returned an empty response."
        )

    output_text = output_text.strip()

    # -----------------------------------------------------
    # Remove accidental markdown fences
    # -----------------------------------------------------

    if output_text.startswith("```"):

        output_text = re.sub(
            r"^```(?:json)?\s*",
            "",
            output_text,
            flags=re.IGNORECASE,
        )

        output_text = re.sub(
            r"\s*```$",
            "",
            output_text,
        ).strip()

    # -----------------------------------------------------
    # Parse JSON
    # -----------------------------------------------------

    try:

        result = json.loads(output_text)

    except json.JSONDecodeError as exc:

        print("\nRaw AI response:")
        print(output_text)

        raise RuntimeError(
            "The AI returned invalid JSON."
        ) from exc

    # -----------------------------------------------------
    # Validate drafts structure
    # -----------------------------------------------------

    drafts = result.get("drafts")

    if not isinstance(drafts, list):
        raise RuntimeError(
            "AI response does not contain a valid drafts list."
        )

    cleaned_drafts = []

    for draft in drafts:

        if not isinstance(draft, dict):
            continue

        content = draft.get("content")

        if isinstance(content, str) and content.strip():

            cleaned_drafts.append(
                {
                    "content": content.strip()
                }
            )

    if not cleaned_drafts:
        raise RuntimeError(
            "AI did not return any valid drafts."
        )

    # -----------------------------------------------------
    # Grounding validation
    # -----------------------------------------------------

    validated_drafts = []

    for draft in cleaned_drafts:

        content = draft["content"]

        grounding = validate_grounding(
            original_text,
            content
        )

        if grounding["is_grounded"]:

            validated_drafts.append(
                {
                    "content": content,
                    "grounding": grounding,
                }
            )

        else:

            print(
                "\nWARNING: Unsupported claims detected."
            )

            for warning in grounding["warnings"]:
                print(f"  - {warning}")

    # -----------------------------------------------------
    # Return valid drafts
    # -----------------------------------------------------

    if not validated_drafts:
        raise RuntimeError(
            "All generated drafts contained unsupported claims."
        )

    return validated_drafts[:number_of_drafts]


# =========================================================
# Local test
# =========================================================

if __name__ == "__main__":

    test_post = (
        "I recently completed a machine learning project "
        "using Python, Pandas and Scikit-learn. "
        "The project helped me understand how data "
        "preprocessing and classification work together."
    )

    print("=" * 60)
    print("LinkedAI Generative AI Test")
    print("=" * 60)

    print("\nGenerating drafts...\n")

    drafts = generate_posts(
        original_text=test_post,
        category="PROJECT",
        tone="Professional",
        number_of_drafts=3,
    )

    for index, draft in enumerate(
        drafts,
        start=1
    ):

        print("=" * 60)
        print(f"DRAFT {index}")
        print("=" * 60)

        print(draft["content"])

        print("\nGrounding:")
        print(draft["grounding"])

        print()