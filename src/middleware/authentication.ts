import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "../config";
import { sendError } from "../errorResponse";

export const verifyJwtToken = (
  request: Request,
  response: Response,
  next
) => {
  const token = request.headers["x-access-token"];

  if (!token) {
    sendError(request, response, StatusCodes.UNAUTHORIZED, "Requires authentication");
    return;
  }

  jwt.verify(token, config.secret, (error, decoded) => {
    if (error) {
      sendError(request, response, StatusCodes.UNAUTHORIZED, "Requires authentication");
      return;
    }

    request.body.userId = decoded.id;
    next();
  });
};
