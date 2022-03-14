import compression from "compression";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dataService from "./data/dataService";
import startServer from "./server";
import routes from "./routes";
import connect from "./data/connect";

const app = express();

// Middleware
app.use(rateLimit({
  windowMs: 60 * 100, // 1 minute
  max: 1000
}));
app.use(compression());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));

app.use("/", dataService, routes);

connect().then(() => startServer(app));

export default app;