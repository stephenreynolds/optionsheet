import { Request, Response } from "express";
import path from "path";
import config from "../config";

export const getApp = async (request: Request, response: Response) => {
  if (config.isProduction) {
    response.sendFile(path.resolve(__dirname, "public/index.html"));
  } else {
    response.redirect(
      `http://${config.host}:${config.devPort}${request.originalUrl}`
    );
  }
};
