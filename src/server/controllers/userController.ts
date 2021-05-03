import { getRepository } from "typeorm";
import { Request, Response } from "express";
import HttpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import { User } from "../data/entity/user";

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
  const user: User = {
    username: username,
    email: email,
    passwordHash
  };
  await userRepository.save(user);
  response.sendStatus(HttpStatus.OK);
};

export const checkUsername = async (request: Request, response: Response): Promise<void> => {
  const userRepository = getRepository(User);
  const username = request.body.username;

  if (!username) {
    // Request received without a username.
    const message = {
      reason: "USERNAME_MISSING",
      message: "Username is missing."
    };
    response.status(HttpStatus.BAD_REQUEST).send(message);
    return;
  }

  const user = await userRepository.findOne({ username });
  if (user) {
    // A user already has this username.
    const message = {
      reason: "USERNAME_TAKEN",
      message: "That username is already taken."
    };
    response.status(HttpStatus.OK).send(message);
    return;
  }
  response.sendStatus(HttpStatus.OK);
};

export const checkEmail = async (request: Request, response: Response): Promise<void> => {
  const userRepository = getRepository(User);
  const email = request.body.email;

  if (!email) {
    // Request received without an email address.
    const message = {
      reason: "EMAIL_MISSING",
      message: "Email address is missing."
    };
    response.status(HttpStatus.BAD_REQUEST).send(message);
    return;
  }

  const user = await userRepository.findOne({ email });
  if (user) {
    // A user already has this email address.
    const message = {
      reason: "EMAIL_TAKEN",
      message: "That email address is already in use."
    };
    response.status(HttpStatus.OK).send(message);
    return;
  }
  response.sendStatus(HttpStatus.OK);
};