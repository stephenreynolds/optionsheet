import * as path from "path";
import winston from "winston";
import config from "./config";

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    customFormat
  ),
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
      winston.format.timestamp(),
      customFormat
    )
  }));
}

export default logger;