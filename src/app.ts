import compression from "compression";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createConnection } from "typeorm";
import ormConfig from "./data/ormConfig";

createConnection(ormConfig).then();

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 100, // 1 minute
  max: 100
});

// Middleware
app.use(limiter);
app.use(compression());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));

export default app;