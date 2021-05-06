import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../data/entity/user";
import HttpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";

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
    response.status(HttpStatus.NOT_FOUND).send("User not found.");
    return;
  }

  const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordIsValid) {
    response.status(HttpStatus.UNAUTHORIZED).send("Incorrect password.");
  }

  const token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400 // 24 hours
  });

  response.status(HttpStatus.OK).send({ token });
};

export const getMyInfo = async (request: Request, response: Response) => {
  const userRepository = getRepository(User);

  const id = request.body.userId;
  if (!id) {
    return response.status(HttpStatus.BAD_REQUEST).send("User id not provided");
  }

  let user = await userRepository.findOne(id);
  if (!user) {
    return response.status(HttpStatus.BAD_REQUEST).send("User not found");
  }

  const data = {
    username: user.username,
    email: user.email,
    id: user.id
  };

  return response.send(data);
};