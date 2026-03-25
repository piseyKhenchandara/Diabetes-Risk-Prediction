const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "";

function buildPredictUrl() {
  // In dev, empty base URL uses Vite proxy (/api -> localhost:5000).
  if (!configuredBaseUrl) {
    return "/api/predict";
  }

  return `${configuredBaseUrl}/api/predict`;
}

export async function requestPrediction(payload) {
  const response = await fetch(buildPredictUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || !data?.success) {
    throw new Error(
      data?.message ||
        `Prediction request failed with status ${response.status}.`,
    );
  }

  return data;
}
