import { validatePredictionInput } from "../validators/predictValidator.js";
import { getMockPrediction } from "../services/mockPredictor.js";

export function predict(req, res, next) {
  try {
    const input = validatePredictionInput(req.body);
    const result = getMockPrediction(input);

    res.json({
      success: true,
      data: result,
      modelStatus: "mock",
    });
  } catch (error) {
    next(error);
  }
}
