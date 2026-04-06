CREATE TABLE IF NOT EXISTS predictions (
  id               SERIAL PRIMARY KEY,
  pregnancies      FLOAT NOT NULL,
  glucose          FLOAT NOT NULL,
  blood_pressure   FLOAT NOT NULL,
  skin_thickness   FLOAT NOT NULL,
  insulin          FLOAT NOT NULL,
  bmi              FLOAT NOT NULL,
  diabetes_pedigree FLOAT NOT NULL,
  age              FLOAT NOT NULL,
  outcome          VARCHAR(50),
  risk_percent     FLOAT,
  model_status     VARCHAR(10),
  created_at       TIMESTAMP DEFAULT NOW()
);
