import { useState } from "react";

const initialValues = {
  pregnancies: "",
  bloodPressure: "",
  glucose: "",
  skinThickness: "",
  insulin: "",
  weight: "",
  height: "",
  parentsCount: 0,
  siblingCount: 0,
  extendedCount: 0,
  age: "",
};

// Tab order: most-used clinical values first, then demographics, then body measurements
const fields = [
  {
    name: "glucose",
    label: "Glucose (mg/dL)",
    description: "Plasma glucose — 2 h oral glucose tolerance test",
    placeholder: "e.g. 120",
    min: 1,
    max: 500,
  },
  {
    name: "insulin",
    label: "Insulin (μU/mL)",
    description: "Serum insulin level, 2 h post-glucose load",
    placeholder: "e.g. 85",
    min: 1,
    max: 900,
  },
  {
    name: "bloodPressure",
    label: "Blood Pressure (mm Hg)",
    description: "Diastolic blood pressure",
    placeholder: "e.g. 72",
    min: 1,
    max: 200,
  },
  {
    name: "skinThickness",
    label: "Skin Thickness (mm)",
    description: "Triceps skin fold thickness",
    placeholder: "e.g. 20",
    min: 1,
    max: 100,
  },
  {
    name: "pregnancies",
    label: "Pregnancies",
    description: "Total pregnancies — enter 0 for male / nulliparous",
    placeholder: "e.g. 2",
    optional: true,
    min: 0,
    max: 20,
  },
  {
    name: "age",
    label: "Age (years)",
    description: "Patient age in years",
    placeholder: "e.g. 33",
    min: 1,
    max: 120,
  },
  {
    name: "weight",
    label: "Weight (kg)",
    description: "Body weight in kilograms",
    placeholder: "e.g. 70",
    min: 10,
    max: 300,
  },
  {
    name: "height",
    label: "Height (cm)",
    description: "Height in centimeters",
    placeholder: "e.g. 170",
    min: 50,
    max: 250,
  },
];

function calculateDPF(parentsCount, siblingCount, extendedCount) {
  const score = (parentsCount * 0.5) + (siblingCount * 0.5) + (extendedCount * 0.125);
  return Math.min(2.5, Math.max(0.08, score));
}

function validate(name, value, field) {
  if (field.optional && value === "") return null;
  if (!field.optional && value === "") return "This field is required.";
  const num = Number(value);
  if (isNaN(num)) return "Must be a number.";
  if (num < field.min) return `Minimum value is ${field.min}.`;
  if (num > field.max) return `Maximum value is ${field.max}.`;
  return null;
}

export function PredictionForm({ onSubmit, loading }) {
  const [formValues, setFormValues] = useState(initialValues);
  const [touched, setTouched] = useState({});

  const weight = Number(formValues.weight);
  const height = Number(formValues.height);
  const calculatedBmi =
    weight > 0 && height > 0
      ? (weight / Math.pow(height / 100, 2)).toFixed(1)
      : null;

  const calculatedDpf = calculateDPF(
    Number(formValues.parentsCount),
    Number(formValues.siblingCount),
    Number(formValues.extendedCount)
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const allTouched = Object.fromEntries(fields.map((f) => [f.name, true]));
    setTouched(allTouched);
    const hasErrors = fields.some((f) => validate(f.name, formValues[f.name], f));
    if (hasErrors) return;
    const { weight: w, height: h, parentsCount: pc, siblingCount: sc, extendedCount: ec, ...rest } = formValues;
    const bmi = (Number(w) / Math.pow(Number(h) / 100, 2)).toFixed(1);
    const dpf = calculateDPF(Number(pc), Number(sc), Number(ec));
    onSubmit({ ...rest, bmi, diabetesPedigree: dpf.toFixed(3) });
  }

  function handleReset() {
    setFormValues(initialValues);
    setTouched({});
  }

  const renderField = (field) => {
    const error = touched[field.name] ? validate(field.name, formValues[field.name], field) : null;
    return (
      <label key={field.name} className="field">
        <span className="field-label">{field.label}</span>
        <small className="field-description">{field.description}</small>
        <input
          type="number"
          step="any"
          name={field.name}
          value={formValues[field.name]}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={field.placeholder}
          className={error ? "input--error" : ""}
        />
        {error && <span className="field-error">{error}</span>}
        {field.name === "height" && calculatedBmi && (
          <small className="bmi-preview">BMI: {calculatedBmi}</small>
        )}
      </label>
    );
  };

  return (
    <form className="prediction-form" onSubmit={handleFormSubmit} noValidate>
      <h2>Input Health Information</h2>

      <div className="form-grid">
        {fields.map(renderField)}
      </div>

      <div className="family-history-section">
        <h3 className="section-header">Genetic &amp; Family History</h3>
        <p className="field-description">Count family members diagnosed with Type 2 Diabetes.</p>
        <div className="body-row">
          {[
            { name: "parentsCount",  label: "Parents with T2D",                     weight: "0.50 each", max: 2 },
            { name: "siblingCount",  label: "Siblings with T2D",                    weight: "0.50 each", max: 20 },
            { name: "extendedCount", label: "Grandparents / Aunts / Uncles with T2D", weight: "0.125 each", max: 20 },
          ].map(({ name, label, weight, max }) => (
            <div key={name} className="dpf-box">
              <span className="dpf-box__label">{label}</span>
              <small className="dpf-box__weight">Weight: {weight}</small>
              <div className="dpf-stepper">
                <input
                  type="number"
                  className="dpf-stepper__input"
                  value={formValues[name]}
                  min={0}
                  max={max}
                  step={1}
                  onChange={(e) => {
                    const val = Math.min(max, Math.max(0, Number(e.target.value)));
                    setFormValues((v) => ({ ...v, [name]: isNaN(val) ? 0 : val }));
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="bmi-preview">
          Family History Score (DPF): <strong>{calculatedDpf.toFixed(3)}</strong>
        </div>
      </div>

      <div className="actions">
        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
        <button
          type="button"
          className="ghost"
          onClick={handleReset}
          disabled={loading}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
