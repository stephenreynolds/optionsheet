import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { sendError } from "../error";
import config from "../config";

export const verifyJwtToken = (request: Request, response: Response, next) => {
  const token = request.headers["x-access-token"];

  if (!token) {
    sendError(request, response, StatusCodes.UNAUTHORIZED, "Requires authentication");
    return;
  }

  jwt.verify(token, config.jwt.secret, (error, decoded) => {
    if (error) {
      let message = "Unauthorized";
      if (error instanceof TokenExpiredError) {
        message = "Token expired";
      }
      sendError(request, response, StatusCodes.UNAUTHORIZED, message);
      return;
    }

    request.body.userId = decoded.id;
    next();
  });
};
