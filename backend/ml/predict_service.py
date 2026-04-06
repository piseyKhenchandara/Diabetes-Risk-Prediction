import os
import joblib
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

# --- Load model artifacts ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(BASE_DIR, "logistic_regression_model.joblib"))
scaler = joblib.load(os.path.join(BASE_DIR, "standard_scaler.joblib"))

# Must match the exact column order used during training
FEATURE_NAMES = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age",
]

# Maps incoming JSON keys (from Node.js) to feature names above
INPUT_KEY_MAP = {
    "pregnancies":    "Pregnancies",
    "glucose":        "Glucose",
    "bloodPressure":  "BloodPressure",
    "skinThickness":  "SkinThickness",
    "insulin":        "Insulin",
    "bmi":            "BMI",
    "diabetesPedigree": "DiabetesPedigreeFunction",
    "age":            "Age",
}


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)

    # Build feature vector in the correct order
    try:
        raw_values = {INPUT_KEY_MAP[k]: float(data[k]) for k in INPUT_KEY_MAP}
        feature_vector = np.array([[raw_values[f] for f in FEATURE_NAMES]])
    except (KeyError, TypeError, ValueError) as e:
        return jsonify({"error": f"Invalid input: {e}"}), 400

    # Scale the input
    scaled_vector = scaler.transform(feature_vector)

    # Predict
    prediction = int(model.predict(scaled_vector)[0])
    probabilities = model.predict_proba(scaled_vector)[0]
    risk_percent = round(float(probabilities[1]) * 100, 2)

    # Compute per-feature contribution: coefficient * scaled_value
    coefficients = model.coef_[0]
    contributions = scaled_vector[0] * coefficients

    contributors = [
        {
            "label": FEATURE_NAMES[i],
            "value": round(feature_vector[0][i], 4),
            "contribution": round(float(abs(contributions[i])), 4),
        }
        for i in range(len(FEATURE_NAMES))
    ]
    top_contributors = sorted(contributors, key=lambda x: x["contribution"], reverse=True)[:3]
    top_names = [c["label"] for c in top_contributors]

    outcome = "High Risk" if prediction == 1 else "Low Risk"
    reason_summary = (
        f"The score is mainly influenced by {', '.join(top_names)}. "
        + ("Higher-than-normal values were detected." if prediction == 1 else "Values appear within normal range.")
    )

    return jsonify({
        "outcome": outcome,
        "riskPercent": risk_percent,
        "topContributors": top_contributors,
        "reasonSummary": reason_summary,
        "explanation": f"Logistic Regression model — {risk_percent}% probability of diabetes.",
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
