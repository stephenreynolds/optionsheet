import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getRepository } from "typeorm";
import { User } from "../data/entities/user";
import { sendError } from "../errorResponse";
import config from "../config";

export const authenticate = async (
  request: Request,
  response: Response
): Promise<void> => {
  const username = request.body.username;
  const email = request.body.email;
  const password = request.body.password;

  const userRepository = getRepository(User);
  let user: User;

  if (username) {
    user = await userRepository.findOne({ username });
  }
  else if (email) {
    user = await userRepository.findOne({ email });
  }
  else {
    sendError(request, response, StatusCodes.BAD_REQUEST, "Need username or email to authenticate.");
    return;
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

export const emailAndUsernameAvailable = async (request: Request, response: Response) => {
  try {
    const userRepository = getRepository(User);
    let available = true;

    if (request.query.email) {
      const email = request.query.email.toString();
      const userWithEmail = await userRepository.findOne({ email });
      available = !userWithEmail;
    }

    if (request.query.username) {
      const username = request.query.username.toString();
      const userWithName = await userRepository.findOne({ username });
      available = !userWithName;
    }

    response.send({ available });
  }
  catch (error) {
    const message = "Failed to check if email and username are available";
    console.log(`${message}: ${error.message}`);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};