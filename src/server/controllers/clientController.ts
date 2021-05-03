import { NextFunction, Request, Response } from "express";
import path from "path";
import config from "../config";

export class ClientController {
  async app(request: Request, response: Response, next: NextFunction) {
    if (config.isProduction) {
      response.sendFile(path.resolve("index.html"));
    } else {
      response.redirect(`${config.host}:${config.devPort}`);
    }
  }
}
