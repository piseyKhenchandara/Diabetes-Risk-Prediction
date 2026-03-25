import { useState } from "react";
import { PredictionForm } from "./components/PredictionForm.jsx";
import { ResultCard } from "./components/ResultCard.jsx";
import { requestPrediction } from "./api/predictApi.js";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(formValues) {
    setLoading(true);
    setError("");

    try {
      const response = await requestPrediction(formValues);
      setResult(response.data);
    } catch (requestError) {
      setResult(null);
      setError(requestError.message || "Failed to get prediction.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Type 2 Diabetes Project</p>
        <h1>Diabetes Risk Check</h1>
        <p className="subtitle">
          Enter health metrics to get an initial risk prediction from the dashboard.
        </p>
      </section>

      <section className="panel">
        <PredictionForm onSubmit={handleSubmit} loading={loading} />
        <ResultCard result={result} error={error} loading={loading} />
      </section>
    </main>
  );
}
