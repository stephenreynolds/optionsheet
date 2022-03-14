import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getRepository } from "typeorm";
import { Role } from "../data/entities/role";
import { User } from "../data/entities/user";
import { sendError } from "../errorResponse";

export const createUser = async (request: Request, response: Response) => {
  const userRepository = getRepository(User);
  const username = request.body.username;
  const email = request.body.email;
  const password = request.body.password;
  const confirm = request.body.confirm;

  // Check that the email address is valid.
  // eslint-disable-next-line no-control-regex
  const emailRegex = /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"(\[]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/;
  if (email.length >= 255 || !emailRegex.test(email)) {
    sendError(request, response, StatusCodes.BAD_REQUEST, "Invalid email address.");
    return;
  }

  // Check that the password and confirmation match.
  if (password !== confirm) {
    sendError(request, response, StatusCodes.BAD_REQUEST, "Password and confirmation do not match.");
    return;
  }

  // Check that the password is valid.
  const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
  if (!passwordRegex.test(password)) {
    sendError(request, response, StatusCodes.BAD_REQUEST, "Password is too weak.");
    return;
  }

  // Check that username and email address are not in use.
  let existingUser = await userRepository.findOne({ username });
  if (existingUser) {
    sendError(request, response, StatusCodes.BAD_REQUEST, "A user with that username already exists.");
    return;
  }
  existingUser = await userRepository.findOne({ email });
  if (existingUser) {
    sendError(request, response, StatusCodes.BAD_REQUEST, "A user with that email address already exists.");
    return;
  }

  // Save the new user to the database.
  const roleRepository = getRepository(Role);
  const role = await roleRepository.findOne({ name: "user" });
  const user = {
    username,
    email,
    passwordHash: await bcrypt.hash(password, 12), // Salt the password.
    roles: [role]
  };
  const newUser = await userRepository.save(user);

  const token = newUser.createToken();
  const refreshToken = newUser.createRefreshToken();

  response.send({ token, refreshToken });
};