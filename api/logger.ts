import * as path from "path";
import winston from "winston";
import config from "./config";

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = process.env.NODE_ENV === "test" ? {
    add: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  } :
  winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      customFormat
    ),
    defaultMeta: { service: "optionsheet" },
    transports: [
      new winston.transports.File({ filename: path.resolve(__dirname, "error.log"), level: "error" }),
      new winston.transports.File({ filename: path.resolve(__dirname, "server.log") }),
      !config.isProduction ? new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          customFormat
        )
      }) : null
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: path.resolve(__dirname, "error.log"), level: "error" })
    ]
  });

export default logger;