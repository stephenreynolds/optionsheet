import express from "express";
import * as path from "path";
import swaggerUi from "swagger-ui-express";
import app from "./app";
import config from "./config";
import { Database } from "./data/database";
import logger from "./logger";
import Request from "./request";
import routes from "./routes";
import * as swaggerDocument from "./swagger.json";

// Connect to the database and inject a wrapper into every request.
const database = new Database();

app.use(async (req: Request, res, next) => {
  req.dataService = database;
  next();
}, routes);

// Swagger UI
app.use("/swagger",
  express.static("swagger-ui-dist/", { index: false }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument));

// Uploaded files
app.use("/uploads", express.static(path.resolve(__dirname, "uploads/"), { index: false }));

app.listen(config.port, config.host, () => {
  logger.info(`Server listening at ${config.host}:${config.port}`);
});