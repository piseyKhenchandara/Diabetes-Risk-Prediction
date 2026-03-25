# Diabetes Measurement Dashboard

Simple full-stack starter for a Type 2 diabetes risk dashboard.

## Tech Stack

- Backend: Node.js + Express
- Frontend: React + Vite
- ML integration (later): Python + Scikit-learn + Pickle

## Project Structure

- `backend/`: API for health check and prediction endpoint
- `frontend/`: Dashboard UI for input and result display

## Quick Start

### 1. Start backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2. Start frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Current API

### `GET /api/health`

Returns API status.

### `POST /api/predict`

Accepts:

```json
{
  "pregnancies": 2,
  "bloodPressure": 72,
  "glucose": 128,
  "skinThickness": 25,
  "insulin": 94,
  "bmi": 29.7,
  "diabetesPedigree": 0.45,
  "age": 34
}
```

Returns a mock prediction response for UI integration/testing.

## How to plug in your Python model later

1. Keep frontend unchanged.
2. Replace the mock logic in `backend/src/services/mockPredictor.js`.
3. Add a Python bridge service (child process, REST microservice, or script call).
4. Return the same response shape so frontend still works.
