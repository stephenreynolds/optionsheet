import { Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

export const sendError = (request: Request, response: Response, status: StatusCodes, message: string) => {
  const errorResponse = {
    timestamp: new Date(),
    status,
    error: getReasonPhrase(status),
    message,
    path: request.originalUrl
  };

  response.status(errorResponse.status).send(errorResponse);
};

export const logError = (error, message) => {
  console.log(`${message}: ${error.message}`);
};