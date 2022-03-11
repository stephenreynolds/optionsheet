import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 100, // 1 minute
  max: 100
});

// Middleware
app.use(limiter);
app.use(compression());
app.use(cors());

export default app;