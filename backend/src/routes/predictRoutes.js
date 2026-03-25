import { Router } from "express";
import { predict } from "../controllers/predictController.js";

export const predictRouter = Router();

predictRouter.post("/", predict);
