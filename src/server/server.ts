import "reflect-metadata";
import compression from "compression";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import { createConnection } from "typeorm";
import config from "./config";
import { attachRoutes } from "./routes";
import { seedData } from "./data/seed";

const database = async () => {
  const connection = await createConnection(config.connectionOptions);
  await seedData(connection);
};

const start = async () => {
  const app = express();

  // Middleware
  app.use(compression());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morgan("tiny")); // Logging

  // Serve static files
  if (config.isProduction) {
    app.use(express.static(path.join(__dirname, "public")));
  }

  attachRoutes(app);

  // Listen for requests
  app.listen(config.port, config.host, () => {
    console.log(`Server listening on ${config.host}:${config.port}`);
  });
};

database().then(() => start());
