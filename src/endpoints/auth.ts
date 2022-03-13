import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getRepository } from "typeorm";
import { User } from "../data/entities/user";
import { logError, sendError } from "../errorResponse";
import config from "../config";

export const authenticate = async (request: Request, response: Response) => {
  try {
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
      return sendError(request, response, StatusCodes.BAD_REQUEST, "Need username or email to authenticate.");
    }

    if (!user) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsValid) {
      return sendError(request, response, StatusCodes.UNAUTHORIZED, "Incorrect password.");
    }

    const token = jwt.signJwtToken({id: user.id}, config.jwt.secret, {
      expiresIn: config.jwt.jwtExpiration
    });

    response.status(StatusCodes.OK).send({ token });
  }
  catch (error) {
    const message = "Failed to authenticate";
    logError(error, message);
    return sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
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
    logError(error, message);
    return sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};