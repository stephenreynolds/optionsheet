import express from "express";
import compression from "compression";
import config from "./config";
import rateLimit from "express-rate-limit";

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100
});

// Middleware
app.use(limiter);
app.use(compression());

app.listen(config.port, config.host, () => {
  console.log(`Server listening on ${config.host}:${config.port}`);
});