function toNumber(value, fieldName) {
  const converted = Number(value);

  if (Number.isNaN(converted)) {
    const error = new Error(`${fieldName} must be a valid number.`);
    error.status = 400;
    throw error;
  }

  return converted;
}

function validateRange(value, fieldName, min, max) {
  if (value < min || value > max) {
    const error = new Error(`${fieldName} must be between ${min} and ${max}.`);
    error.status = 400;
    throw error;
  }
}

export function validatePredictionInput(body) {
  if (!body || typeof body !== "object") {
    const error = new Error("Request body is required.");
    error.status = 400;
    throw error;
  }

  const cleaned = {
    pregnancies:
      body.pregnancies === "" ||
      body.pregnancies === null ||
      body.pregnancies === undefined
        ? 0
        : toNumber(body.pregnancies, "pregnancies"),
    bloodPressure: toNumber(body.bloodPressure, "bloodPressure"),
    glucose: toNumber(body.glucose, "glucose"),
    skinThickness: toNumber(body.skinThickness, "skinThickness"),
    insulin: toNumber(body.insulin, "insulin"),
    bmi: toNumber(body.bmi, "bmi"),
    diabetesPedigree: toNumber(body.diabetesPedigree, "diabetesPedigree"),
    age: toNumber(body.age, "age"),
  };

  validateRange(cleaned.pregnancies, "pregnancies", 0, 20);
  validateRange(cleaned.bloodPressure, "bloodPressure", 1, 200);
  validateRange(cleaned.glucose, "glucose", 1, 500);
  validateRange(cleaned.skinThickness, "skinThickness", 0, 100);
  validateRange(cleaned.insulin, "insulin", 0, 900);
  validateRange(cleaned.bmi, "bmi", 10, 70);
  validateRange(cleaned.diabetesPedigree, "diabetesPedigree", 0, 3);
  validateRange(cleaned.age, "age", 1, 120);

  return cleaned;
}
