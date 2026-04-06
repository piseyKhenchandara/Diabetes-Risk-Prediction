const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:5001";

export async function getPythonPrediction(input) {
  const response = await fetch(`${PYTHON_SERVICE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Python service error ${response.status}: ${text}`);
  }

  return response.json();
}
