import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import routes from "./routes";

const app = express();

// Middleware
app.use(rateLimit({
  windowMs: 60 * 100, // 1 minute
  max: 1000
}));
app.use(compression());
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny", { skip: () => process.env.NODE_ENV === "test" }));
app.use(routes);

export default app;