import { validatePredictionInput } from "../validators/predictValidator.js";
import { getMockPrediction } from "../services/mockPredictor.js";
import { getPythonPrediction } from "../services/pythonModelService.js";
import pool from "../config/db.js";

const USE_REAL_MODEL = process.env.PYTHON_SERVICE_URL !== undefined && process.env.PYTHON_SERVICE_URL !== "";

export async function predict(req, res, next) {
  try {
    const input = validatePredictionInput(req.body);
    const result = USE_REAL_MODEL
      ? await getPythonPrediction(input)
      : getMockPrediction(input);

    const modelStatus = USE_REAL_MODEL ? "real" : "mock";

    // Save to DB if available — non-blocking, failure won't break the response
    if (pool) {
      pool.query(
        `INSERT INTO predictions
          (pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, diabetes_pedigree, age, outcome, risk_percent, model_status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          input.pregnancies, input.glucose, input.bloodPressure,
          input.skinThickness, input.insulin, input.bmi,
          input.diabetesPedigree, input.age,
          result.outcome, result.riskPercent, modelStatus,
        ]
      ).catch((err) => console.warn("DB save failed:", err.message));
    }

    res.json({ success: true, data: result, modelStatus });
  } catch (error) {
    next(error);
  }
}
