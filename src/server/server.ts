import "reflect-metadata";
import cors from "cors";
import express, { Request, Response } from "express";
import morgan from "morgan";
import path from "path";
import { Connection, createConnection } from "typeorm";
import config from "./config";
import { Routes } from "./routes";

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

  // Register express routes from defined application routes
  Routes.forEach((route) => {
    app[route.method](
      route.route,
      (req: Request, res: Response, next: Function) => {
        const result = new (route.controller as any)()[route.action](
          req,
          res,
          next
        );
        if (result instanceof Promise) {
          result.then((result) =>
            result !== null && result !== undefined
              ? res.send(result)
              : undefined
          );
        } else if (result !== null && result !== undefined) {
          res.json(result);
        }
      }
    );
  });

  // Listen for requests
  app.listen(config.port, config.host, () => {
    console.log(`Server listening on ${config.host}:${config.port}`);
  });
}
