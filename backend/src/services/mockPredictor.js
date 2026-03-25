function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const featureDefinitions = [
  { key: "glucose", label: "Glucose", weight: 0.35, high: 140 },
  { key: "bmi", label: "BMI", weight: 1.1, high: 30 },
  { key: "age", label: "Age", weight: 0.45, high: 45 },
  {
    key: "diabetesPedigree",
    label: "Diabetes Pedigree",
    weight: 35,
    high: 0.7,
  },
  { key: "bloodPressure", label: "Blood Pressure", weight: 0.12, high: 80 },
  { key: "insulin", label: "Insulin", weight: 0.01, high: 160 },
  { key: "skinThickness", label: "Skin Thickness", weight: 0.08, high: 30 },
  { key: "pregnancies", label: "Pregnancies", weight: 1.2, high: 4 },
];

function buildReasonSummary(input, topContributors) {
  const contributorText = topContributors
    .map((item) => `${item.label} (${item.value})`)
    .join(", ");

  const highSignals = featureDefinitions
    .filter((feature) => input[feature.key] >= feature.high)
    .map((feature) => feature.label.toLowerCase());

  const signalText =
    highSignals.length > 0
      ? ` Higher-than-threshold signals were seen in ${highSignals.join(", ")}.`
      : " Most values are near lower-risk ranges in this mock model.";

  return `The score is mainly influenced by ${contributorText}.${signalText}`;
}

export function getMockPrediction(input) {
  const contributions = featureDefinitions.map((feature) => ({
    key: feature.key,
    label: feature.label,
    value: input[feature.key],
    contribution: input[feature.key] * feature.weight,
  }));

  const weightedScore = contributions.reduce(
    (total, item) => total + item.contribution,
    0,
  );

  const normalizedScore = clamp(weightedScore / 140, 0, 1);
  const riskPercent = Math.round(normalizedScore * 100);
  const outcome =
    riskPercent >= 50 ? "Likely Diabetes" : "Less Likely Diabetes";

  const topContributors = [...contributions]
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 3)
    .map((item) => ({
      label: item.label,
      value: item.value,
      contribution: Number(item.contribution.toFixed(2)),
    }));

  const reasonSummary = buildReasonSummary(input, topContributors);

  return {
    outcome,
    riskPercent,
    reasonSummary,
    topContributors,
    explanation:
      "This is a mock prediction for integration testing. Replace this logic with your trained Python model.",
  };
}
