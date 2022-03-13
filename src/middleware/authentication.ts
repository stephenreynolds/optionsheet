import { Request, Response } from "express";
import HttpStatus from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "../config";
import { getRepository } from "typeorm";
import { User } from "../data/entities/user";

export const verifyJwtToken = (
  request: Request,
  response: Response,
  next
) => {
  const token = request.headers["x-access-token"];

  if (!token) {
    return response.status(HttpStatus.UNAUTHORIZED).send("Requires authentication");
  }

  jwt.verify(token, config.secret, (error, decoded) => {
    if (error) {
      return response.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    request.body.userId = decoded.id;
    next();
  });
};

export const isAdmin = (
  request: Request,
  response: Response,
  next
) => {
  const userRepository = getRepository(User);
  userRepository.findOne(request.body.userId).then((user) => {
    const admin = user.roles.find((role) => role.name === "admin");
    if (admin) {
      next();
      return;
    }

    response.status(HttpStatus.UNAUTHORIZED).send("Requires admin role");
    return;
  });
};

export const isModerator = (
  request: Request,
  response: Response,
  next
) => {
  const userRepository = getRepository(User);
  userRepository.findOne(request.body.userId).then((user) => {
    const moderator = user.roles.find(
      (role) => role.name === "moderator" || role.name === "admin"
    );
    if (moderator) {
      next();
      return;
    }

    response.status(HttpStatus.UNAUTHORIZED).send("Requires moderator role");
    return;
  });
};
