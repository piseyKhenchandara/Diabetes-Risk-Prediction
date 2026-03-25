function getRiskLevel(riskPercent = 0) {
  if (riskPercent < 35) {
    return { label: "Low", tone: "low" };
  }

  if (riskPercent < 70) {
    return { label: "Medium", tone: "medium" };
  }

  return { label: "High", tone: "high" };
}

export function ResultCard({ result, error, loading }) {
  const riskLevel = result ? getRiskLevel(result.riskPercent) : null;

  return (
    <aside className="result-card">
      <h2>Prediction Result</h2>

      {loading && <p>Calculating risk...</p>}

      {!loading && error && <p className="error">{error}</p>}

      {!loading && !error && !result && (
        <p className="placeholder">
          Fill the form and click Predict to see the result.
        </p>
      )}

      {!loading && !error && result && (
        <div className="result-content">
          <p className={`outcome outcome--${riskLevel.tone}`}>
            {result.outcome}
          </p>
          <p>Risk Score: {result.riskPercent}%</p>
          <p className={`risk-badge risk-badge--${riskLevel.tone}`}>
            Risk Level: {riskLevel.label}
          </p>
          {result.reasonSummary && (
            <p className="reason-summary">
              Why this score: {result.reasonSummary}
            </p>
          )}

          {Array.isArray(result.topContributors) &&
            result.topContributors.length > 0 && (
              <div className="contributors">
                <p className="contributors-title">Top contributors</p>
                <ul>
                  {result.topContributors.map((item) => (
                    <li key={item.label}>
                      {item.label}: value {item.value}, impact{" "}
                      {item.contribution}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          <p className="explanation">{result.explanation}</p>
        </div>
      )}
    </aside>
  );
}
