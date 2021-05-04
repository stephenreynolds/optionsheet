import "reflect-metadata";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import { Connection, createConnection } from "typeorm";
import config from "./config";
import {attachRoutes} from "./routes";

// Connect to database and start server.
createConnection(config.connectionOptions).then(start);

async function start(connection: Connection) {
  const app = express();

  // Middleware
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
}
