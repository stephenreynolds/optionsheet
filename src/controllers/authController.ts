import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import config from "../config";
import { User } from "../data/entities/user";
import { sendError } from "../errorResponse";

export const authenticateUser = async (
  request: Request,
  response: Response
): Promise<void> => {
  const userRepository = getRepository(User);
  const usernameOrEmail = request.body.username || request.body.email;
  const password = request.body.password;

  let user = await userRepository.findOne({ username: usernameOrEmail });
  if (!user) {
    user = await userRepository.findOne({ email: usernameOrEmail });
  }

  if (!user) {
    sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    return;
  }

  const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordIsValid) {
    sendError(request, response, StatusCodes.UNAUTHORIZED, "Incorrect password.");
    return;
  }

  const token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400 // 24 hours
  });

  response.status(StatusCodes.OK).send({ token });
};
