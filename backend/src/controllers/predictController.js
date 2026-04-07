import { validatePredictionInput } from "../validators/predictValidator.js";
import { getMockPrediction } from "../services/mockPredictor.js";
import { getPythonPrediction } from "../services/pythonModelService.js";

const USE_REAL_MODEL = process.env.PYTHON_SERVICE_URL !== undefined && process.env.PYTHON_SERVICE_URL !== "";

export async function predict(req, res, next) {
  try {
    const input = validatePredictionInput(req.body);
    const result = USE_REAL_MODEL
      ? await getPythonPrediction(input)
      : getMockPrediction(input);

    const modelStatus = USE_REAL_MODEL ? "real" : "mock";
    res.json({ success: true, data: result, modelStatus });
  } catch (error) {
    next(error);
  }
}
