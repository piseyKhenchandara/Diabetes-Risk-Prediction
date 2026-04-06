import { createApp } from "./src/app.js";
import { env } from "./src/config/env.js";

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
  console.error(err.stack);
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Backend running on http://localhost:${env.PORT}`);
  console.log(`PYTHON_SERVICE_URL = ${process.env.PYTHON_SERVICE_URL}`);
  console.log(`USE_REAL_MODEL = ${!!process.env.PYTHON_SERVICE_URL}`);
});
