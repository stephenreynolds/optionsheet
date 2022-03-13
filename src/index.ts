import compression from "compression";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import startServer from "./server";
import { createConnection } from "typeorm";
import ormConfig from "./data/ormConfig";
import { seedData } from "./data/seed";
import { attachRoutes } from "./routes";

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

attachRoutes(app);

const connect = async () => {
  const connection = await createConnection(ormConfig);
  await seedData(connection);
};

connect().then(() => startServer(app));