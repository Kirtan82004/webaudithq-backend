import express from "express";
import cors from "cors";
import analyzeRoutes from "./routes/analyze.routes.js";

const app = express();

 app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    credentials: true,
  }));
app.use(express.json());

app.use("/api/analyze", analyzeRoutes);

export default app;
