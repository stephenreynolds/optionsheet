import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import config from "./config";

const app = express();

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max
});

// Middleware
app.use(limiter);
app.use(compression());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

export default app;