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

  const user: User = {
    username: username,
    email: email,
    passwordHash
  };

  await userRepository.save(user);
  response.sendStatus(HttpStatus.OK);
};
