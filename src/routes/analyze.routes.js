import { Router } from "express";
import { runAnalysis } from "../controllers/analyze.controller.js";

const router = Router();

router.post("/", runAnalysis);

export default router;
