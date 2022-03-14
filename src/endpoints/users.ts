import bcrypt from "bcrypt";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logError, sendError } from "../error";
import Request from "../request";

// POST /users
export const createUser = async (request: Request, response: Response) => {
  try {
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

    const dataService = request.dataService;

    // Check that username and email address are not in use.
    let existingUser = await dataService.getUserByName(username);
    if (existingUser) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "A user with that username already exists.");
      return;
    }
    existingUser = await dataService.getUserByEmail(email);
    if (existingUser) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "A user with that email address already exists.");
      return;
    }

    // Save the new user to the database.
    const role = await dataService.getRoleByName("user");
    const user = {
      username,
      email,
      passwordHash: await bcrypt.hash(password, 12), // Salt the password.
      roles: [role]
    };
    const { id } = await dataService.saveUser(user);
    const newUser = await dataService.getUserById(id);

    const token = await dataService.createToken(newUser);
    const refreshToken = await dataService.createRefreshToken(newUser);

    response.send({ token, refreshToken });
  }
  catch (error) {
    const message = "Failed to create user";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};