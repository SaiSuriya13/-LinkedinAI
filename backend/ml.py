import os
import re
import joblib
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


# ---------------------------------------------------------
# Paths
# ---------------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "linkedin_dataset.csv"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "linkedin_classifier.pkl"
)


# ---------------------------------------------------------
# Text preprocessing
# ---------------------------------------------------------

def preprocess_text(text):
    """
    Perform lightweight text normalization.

    Steps:
    - Convert to string
    - Lowercase
    - Remove URLs
    - Remove unnecessary characters
    - Normalize whitespace
    """

    text = str(text).lower()

    # Remove URLs
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)

    # Keep letters, numbers and basic punctuation
    text = re.sub(r"[^a-z0-9\s]", " ", text)

    # Normalize whitespace
    text = re.sub(r"\s+", " ", text).strip()

    return text


# ---------------------------------------------------------
# Load dataset
# ---------------------------------------------------------

def load_dataset():
    """Load and validate the LinkedIn dataset."""

    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(
            f"Dataset not found at: {DATA_PATH}"
        )

    df = pd.read_csv(DATA_PATH)

    required_columns = {"text", "category"}

    if not required_columns.issubset(df.columns):
        raise ValueError(
            "Dataset must contain 'text' and 'category' columns."
        )

    df = df.dropna(subset=["text", "category"])

    df["text"] = df["text"].apply(preprocess_text)

    return df


# ---------------------------------------------------------
# Build ML pipeline
# ---------------------------------------------------------

def build_model():
    """
    Create the TF-IDF + Logistic Regression pipeline.
    """

    model = Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    max_features=5000,
                    ngram_range=(1, 2),
                    min_df=1,
                    sublinear_tf=True,
                ),
            ),
            (
                "classifier",
                LogisticRegression(
                    max_iter=1000,
                    random_state=42,
                ),
            ),
        ]
    )

    return model


# ---------------------------------------------------------
# Train and evaluate
# ---------------------------------------------------------

def train_model():
    """Train, evaluate and save the classifier."""

    print("=" * 60)
    print("LinkedAI ML Training")
    print("=" * 60)

    df = load_dataset()

    print(f"\nDataset size: {len(df)}")
    print(f"Categories: {df['category'].nunique()}")

    print("\nCategory distribution:")
    print(df["category"].value_counts())

    X = df["text"]
    y = df["category"]

    # Stratified split keeps the class distribution balanced
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    print(f"\nTraining samples: {len(X_train)}")
    print(f"Testing samples: {len(X_test)}")

    model = build_model()

    print("\nTraining model...")

    model.fit(X_train, y_train)

    print("Training complete.")

    # Predictions
    y_pred = model.predict(X_test)

    # Accuracy
    accuracy = accuracy_score(y_test, y_pred)

    print("\n" + "=" * 60)
    print("MODEL EVALUATION")
    print("=" * 60)

    print(f"\nAccuracy: {accuracy:.4f}")

    # Precision / Recall / F1
    print("\nClassification Report:")
    print(
        classification_report(
            y_test,
            y_pred,
            zero_division=0
        )
    )

    # Confusion matrix
    labels = sorted(y.unique())

    cm = confusion_matrix(
        y_test,
        y_pred,
        labels=labels
    )

    print("Confusion Matrix:")
    print(cm)

    # Save model
    os.makedirs(MODEL_DIR, exist_ok=True)

    joblib.dump(model, MODEL_PATH)

    print("\n" + "=" * 60)
    print("MODEL SAVED")
    print("=" * 60)

    print(f"\nModel path:")
    print(MODEL_PATH)

    return model


# ---------------------------------------------------------
# Load trained model
# ---------------------------------------------------------

def load_model():
    """Load the trained classifier from disk."""

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            "Trained model not found. "
            "Run train_model() first."
        )

    return joblib.load(MODEL_PATH)


# ---------------------------------------------------------
# Classify a LinkedIn post
# ---------------------------------------------------------
def classify_post(text):
    """
    Predict the category, confidence, confidence level,
    review flag, and alternative category for a LinkedIn post.
    """

    model = load_model()

    cleaned_text = preprocess_text(text)

    if not cleaned_text:
        raise ValueError(
            "Post text cannot be empty."
        )

    # Get probabilities for every category
    probabilities = model.predict_proba(
        [cleaned_text]
    )[0]

    classes = model.classes_

    # Sort categories by probability
    ranked_predictions = sorted(
        zip(classes, probabilities),
        key=lambda item: item[1],
        reverse=True
    )

    prediction = ranked_predictions[0][0]
    confidence = float(ranked_predictions[0][1])

    # Second-best category
    alternative_category = (
        ranked_predictions[1][0]
        if len(ranked_predictions) > 1
        else None
    )

    # -----------------------------------------------------
    # Confidence levels
    # -----------------------------------------------------

    if confidence >= 0.70:
        confidence_level = "HIGH"
        needs_review = False

    elif confidence >= 0.45:
        confidence_level = "MEDIUM"
        needs_review = False

    else:
        confidence_level = "LOW"
        needs_review = True

    return {
        "category": prediction,
        "confidence": round(confidence, 4),
        "confidence_level": confidence_level,
        "needs_review": needs_review,
        "alternative_category": alternative_category,
    }

# ---------------------------------------------------------
# Train when this file is executed directly
# ---------------------------------------------------------
def evaluate_confidence():
    """
    Inspect prediction confidence on the test set.
    """

    df = load_dataset()

    X = df["text"]
    y = df["category"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    model = build_model()

    model.fit(X_train, y_train)

    probabilities = model.predict_proba(X_test)
    predictions = model.predict(X_test)

    confidence_values = probabilities.max(axis=1)

    print("\n" + "=" * 60)
    print("CONFIDENCE ANALYSIS")
    print("=" * 60)

    print(
        f"\nAverage confidence: "
        f"{confidence_values.mean():.4f}"
    )

    print(
        f"Minimum confidence: "
        f"{confidence_values.min():.4f}"
    )

    print(
        f"Maximum confidence: "
        f"{confidence_values.max():.4f}"
    )

    print("\nConfidence ranges:")

    ranges = [
        ("< 0.40", confidence_values < 0.40),
        ("0.40 - 0.59",
         (confidence_values >= 0.40) &
         (confidence_values < 0.60)),
        ("0.60 - 0.79",
         (confidence_values >= 0.60) &
         (confidence_values < 0.80)),
        ("0.80+", confidence_values >= 0.80),
    ]

    for name, mask in ranges:
        print(
            f"{name}: {mask.sum()}"
        )

    print("\nTest predictions:")

    for text, actual, predicted, confidence in zip(
        X_test,
        y_test,
        predictions,
        confidence_values,
    ):
        status = (
            "CORRECT"
            if actual == predicted
            else "WRONG"
        )

        print(
            f"\n[{status}] "
            f"confidence={confidence:.4f}"
        )

        print(
            f"Actual:    {actual}"
        )

        print(
            f"Predicted: {predicted}"
        )

        print(
            f"Text: {text[:120]}..."
        )

if __name__ == "__main__":
    train_model()
