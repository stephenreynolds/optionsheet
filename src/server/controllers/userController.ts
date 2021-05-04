import { getRepository } from "typeorm";
import { Request, Response } from "express";
import HttpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../data/entity/user";
import config from "../config";
import { Role } from "../data/entity/role";

export const createUser = async (request: Request, response: Response) => {
  const userRepository = getRepository(User);
  const username = request.body.username;
  const email = request.body.email;
  const password = request.body.password;

  // Check that the email address is valid.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    response.status(HttpStatus.BAD_REQUEST).send("Invalid email address");
    return;
  }

  // Check that the password is valid.
  const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
  if (!passwordRegex.test(password)) {
    response.status(HttpStatus.BAD_REQUEST).send("Password is too weak.");
    return;
  }

  // Check that username and email address are not in use.
  let existingUser = await userRepository.findOne({ username });
  if (existingUser) {
    response
      .status(HttpStatus.BAD_REQUEST)
      .send("A user with that username already exists.");
    return;
  }
  existingUser = await userRepository.findOne({ email });
  if (existingUser) {
    response
      .status(HttpStatus.BAD_REQUEST)
      .send("A user with that email address already exists.");
    return;
  }

  // Salt the password.
  const passwordHash = await bcrypt.hash(request.body.password, 12);

  // Save the new user to the database.
  const roleRepository = getRepository(Role);
  const role = await roleRepository.findOne({ name: "user" });
  const user: User = {
    username: username,
    email: email,
    passwordHash,
    roles: [role]
  };
  await userRepository.save(user);
  response.sendStatus(HttpStatus.OK);
};

export const checkUsername = async (
  request: Request,
  response: Response
): Promise<void> => {
  const userRepository = getRepository(User);
  const username = request.body.username;

  if (!username) {
    // Request received without a username.
    response.status(HttpStatus.BAD_REQUEST).send("Username is missing.");
    return;
  }

  const user = await userRepository.findOne({ username });
  if (user) {
    // A user already has this username.
    response.status(HttpStatus.OK).send("That username is already taken.");
    return;
  }
  response.sendStatus(HttpStatus.NO_CONTENT);
};

export const checkEmail = async (
  request: Request,
  response: Response
): Promise<void> => {
  const userRepository = getRepository(User);
  const email = request.body.email;

  if (!email) {
    // Request received without an email address.
    response.status(HttpStatus.BAD_REQUEST).send("Email address is missing.");
    return;
  }

  const user = await userRepository.findOne({ email });
  if (user) {
    // A user already has this email address.
    response
      .status(HttpStatus.OK)
      .send("That email address is already in use.");
    return;
  }
  response.sendStatus(HttpStatus.NO_CONTENT);
};

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
