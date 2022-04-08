import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import config from "../config";
import { logError, sendError } from "../error";

export const verifyJwtToken = (request: Request, response: Response, next) => {
  try {
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      return sendError(request, response, StatusCodes.UNAUTHORIZED, "Requires authentication");
    }

    const token = authHeader.split(" ")[1]

    jwt.verify(token, config.jwt.secret, (error, decoded) => {
      if (error) {
        let message = "Unauthorized";
        if (error instanceof TokenExpiredError) {
          message = "Token expired";
        }
        return sendError(request, response, StatusCodes.UNAUTHORIZED, message);
      }

      request.body.userUUID = decoded.uuid;
      next();
    });
  }
  catch (error) {
    logError(error, "Failed to verify JWT token");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to authenticate");
  }
};