import express from "express";
import * as fs from "fs";
import * as path from "path";
import swaggerUi from "swagger-ui-express";
import app from "./app";
import config from "./config";
import logger from "./logger";
import * as swaggerDocument from "./swagger.json";
import { Database } from "./data/database";

// Connect to the database.
Database.connect({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
});

// Swagger UI
app.use("/swagger",
  express.static("swagger-ui-dist/", { index: false }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument));

// Uploaded files
const dir = path.resolve(__dirname, "uploads/images");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
app.use("/uploads", express.static(path.resolve(__dirname, "uploads/"), { index: false }));

app.listen(config.port, config.host, () => {
  logger.info(`Server listening at ${config.host}:${config.port}`);
});