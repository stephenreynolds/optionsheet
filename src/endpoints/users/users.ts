// POST /users
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserCreateModel } from "../../data/models/user";
import { sendError } from "../../error";
import logger from "../../logger";
import Request from "../../request";
import bcrypt from "bcrypt";
import { AuthTokenDto } from "./usersDtos";

const emailIsValid = (email: string) => {
  const emailRegex = /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"(\[]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/;
  return email.length < 255 && emailRegex.test(email);
};

const passwordIsValid = (password: string) => {
  const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
  return passwordRegex.test(password);
};

export const createUser = async (request: Request, response: Response) => {
  try {
    const { username, email, password, confirm } = request.body;

    // Check that the email address is valid.
    if (!emailIsValid(email)) {
      return sendError(request, response, StatusCodes.BAD_REQUEST, "Invalid email address.");
    }

    // Check that the password and confirmation match.
    if (password !== confirm) {
      return sendError(request, response, StatusCodes.BAD_REQUEST, "Password and confirmation do not match.");
    }

    // Check that the password is valid.
    if (!passwordIsValid(password)) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "Password is too weak.");
      return;
    }

    const dataService = request.dataService;

    // Check that username and email address are not in use.
    let existingUser = await dataService.users.getUserByUsername(username);
    if (existingUser) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "A user with that username already exists.");
      return;
    }
    existingUser = await dataService.users.getUserByEmail(email);
    if (existingUser) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "A user with that email address already exists.");
      return;
    }

    // Save the new user to the database.
    const createModel: UserCreateModel = {
      username,
      email,
      passwordHash: await bcrypt.hash(password, 12)
    };
    const { uuid } = await dataService.users.addUser(createModel);

    // Assign user role.
    const role = await dataService.users.getRoleByName("user");
    await dataService.users.addUserRole(uuid, role.id);

    // Create auth tokens.
    const token = await dataService.users.createToken(uuid);
    const refreshToken = await dataService.users.createRefreshToken(uuid);

    const res: AuthTokenDto = {
      token,
      refreshToken: refreshToken.token
    };

    response.send(res);
  }
  catch (error) {
    logger.error(error.message);
    sendError(request, response, error, "Failed to create user");
  }
};