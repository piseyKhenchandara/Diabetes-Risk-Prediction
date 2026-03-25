import { useState } from "react";

const initialValues = {
  pregnancies: "",
  bloodPressure: "",
  glucose: "",
  skinThickness: "",
  insulin: "",
  bmi: "",
  diabetesPedigree: "",
  age: "",
};

const fields = [
  {
    name: "pregnancies",
    label: "Pregnancies (optional)",
    description: "Number of times pregnant. Keep 0 if not applicable.",
    placeholder: "e.g. 2",
  },
  {
    name: "bloodPressure",
    label: "Blood Pressure (mm Hg)",
    description: "Diastolic blood pressure",
    placeholder: "e.g. 72",
  },
  {
    name: "glucose",
    label: "Glucose",
    description: "Plasma glucose concentration a 2 hours in an oral glucose tolerance test",
    placeholder: "e.g. 120",
  },
  {
    name: "skinThickness",
    label: "Skin Thickness (mm)",
    description: "Triceps skin fold thickness",
    placeholder: "e.g. 20",
  },
  {
    name: "insulin",
    label: "Insulin",
    description: "2-Hour serum insulin",
    placeholder: "e.g. 85",
  },
  {
    name: "bmi",
    label: "BMI",
    description: "Body mass index (weight in kg/(height in m)^2)",
    placeholder: "e.g. 28.5",
  },
  {
    name: "diabetesPedigree",
    label: "Diabetes Pedigree",
    description: "Diabetes pedigree function",
    placeholder: "e.g. 0.45",
  },
  {
    name: "age",
    label: "Age",
    description: "type in year",
    placeholder: "e.g. 33",
  },
];

export function PredictionForm({ onSubmit, loading }) {
  const [formValues, setFormValues] = useState(initialValues);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    onSubmit(formValues);
  }

  function handleReset() {
    setFormValues(initialValues);
  }

  return (
    <form className="prediction-form" onSubmit={handleFormSubmit}>
      <h2>Input Health Information</h2>

      <div className="form-grid">
        {fields.map((field) => (
          <label key={field.name} className="field">
            <span className="field-label">{field.label}</span>
            <small className="field-description">{field.description}</small>
            <input
              type="number"
              step="any"
              name={field.name}
              value={formValues[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.name !== "pregnancies"}
            />
          </label>
        ))}
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
