import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { predictRouter } from "./routes/predictRoutes.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN,
    }),
  );
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/predict", predictRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
