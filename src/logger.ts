import * as path from "path";
import winston from "winston";
import config from "./config";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  defaultMeta: { service: "optionsheet" },
  transports: [
    new winston.transports.File({ filename: path.resolve(__dirname, "error.log"), level: "error" }),
    new winston.transports.File({ filename: path.resolve(__dirname, "server.log") })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.resolve(__dirname, "error.log"), level: "error" })
  ]
});

if (!config.isProduction) {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;