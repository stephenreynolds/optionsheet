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
  response.sendStatus(StatusCodes.OK);
};

export const checkUsernameAvailable = async (request: Request, response: Response) => {
  const userRepository = getRepository(User);
  const username = request.body.username;

  const user = await userRepository.findOne({ username });
  response.send({
    usernameAvailable: !!user
  });
};

export const checkEmailAvailable = async (request: Request, response: Response) => {
  const userRepository = getRepository(User);
  const email = request.body.email;

  const user = await userRepository.findOne({ email });
  response.send({
    emailAvailable: !!user
  });
};

export const changeUsername = async (request: Request, response: Response) => {
  try {
    const userRepository = getRepository(User);

    const id = request.body.userId;
    const user = await userRepository.findOne(id);
    if (!user) {
      sendError(request, response, StatusCodes.NOT_FOUND, "User not found.");
      return;
    }

    const username = request.body.username;

    // Check that no user already has that username.
    const match = await userRepository.findOne({ username });
    if (match) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "That username is not available.");
      return;
    }

    user.username = username;
    await userRepository.update({ id }, user);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    console.log(error.message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to change username.");
  }
};

export const changeEmail = async (request: Request, response: Response) => {
  try {
    const userRepository = getRepository(User);

    const id = request.body.userId;
    const user = await userRepository.findOne(id);
    if (!user) {
      sendError(request, response, StatusCodes.NOT_FOUND, "User not found.");
      return;
    }

    const email = request.body.email;

    // Check that no user already has that email address.
    const match = await userRepository.findOne({ email });
    if (match) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "A user with that email address already exists.");
      return;
    }

    user.email = email;
    user.emailConfirmed = false;
    await userRepository.save(user);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    console.log(error.message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to change email address.");
  }
};

export const changePassword = async (request: Request, response: Response) => {
  try {
    const userRepository = getRepository(User);

    const id = request.body.userId;
    const user = await userRepository.findOne(id);
    if (!user) {
      sendError(request, response, StatusCodes.NOT_FOUND, "User not found.");
      return;
    }

    const password = request.body.password;
    const confirm = request.body.confirm;

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

    // Salt the password.
    user.passwordHash = await bcrypt.hash(request.body.password, 12);
    await userRepository.save(user);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    console.log(error.message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to change password.");
  }
};

export const deleteAccount = async (request: Request, response: Response) => {
  try {
    const userRepository = getRepository(User);

    const id = request.body.userId;
    const username = request.params.username;

    const user = await userRepository.findOne({ username });
    if (!user) {
      sendError(request, response, StatusCodes.NOT_FOUND, "User not found.");
      return;
    }
    if (user.id !== id) {
      sendError(request, response, StatusCodes.FORBIDDEN, "Failed to delete user.");
      return;
    }

    await userRepository.delete(id);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    console.log(error.message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete user.");
  }
};