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
    optional: true,
    min: 0,
    max: 20,
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
    name: "glucose",
    label: "Glucose",
    description: "Plasma glucose concentration a 2 hours in an oral glucose tolerance test",
    placeholder: "e.g. 120",
    min: 1,
    max: 500,
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
    name: "insulin",
    label: "Insulin",
    description: "2-Hour serum insulin",
    placeholder: "e.g. 85",
    min: 1,
    max: 900,
  },
  {
    name: "bmi",
    label: "BMI",
    description: "Body Mass Index (kg/m²)",
    placeholder: "e.g. 28.5",
    min: 10,
    max: 70,
  },
  {
    name: "diabetesPedigree",
    label: "Diabetes Pedigree",
    description: "Diabetes pedigree function",
    placeholder: "e.g. 0.45",
    min: 0.001,
    max: 2.5,
  },
  {
    name: "age",
    label: "Age",
    description: "type in year",
    placeholder: "e.g. 33",
    min: 1,
    max: 120,
  },
];

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
    onSubmit({ ...formValues });
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
      </label>
    );
  };

  return (
    <form className="prediction-form" onSubmit={handleFormSubmit} noValidate>
      <h2>Input Health Information</h2>

      <div className="form-grid">
        {fields.map(renderField)}
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
