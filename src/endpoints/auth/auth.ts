// POST /auth
import bcrypt from "bcrypt";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logError, sendError } from "../../error";
import Request from "../../request";
import { AuthTokenDto } from "./authDtos";

export const authenticate = async (request: Request, response: Response) => {
  try {
    const { username, email, password } = request.body;

    let user;
    const dataService = request.dataService;

    if (username) {
      user = await dataService.users.getUserByUsername(username);
    }
    else if (email) {
      user = await dataService.users.getUserByEmail(email);
    }
    else {
      return sendError(request, response, StatusCodes.BAD_REQUEST, "Username or email is required.");
    }

    if (!password) {
      return sendError(request, response, StatusCodes.BAD_REQUEST, "Password is required.");
    }

    if (!user) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    }

    const passwordIsValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordIsValid) {
      return sendError(request, response, StatusCodes.UNAUTHORIZED, "Incorrect password.");
    }

    const token = await dataService.users.createToken(user.uuid);
    const { refresh_token: refreshToken } = await dataService.users.createRefreshToken(user.uuid);

    const res: AuthTokenDto = {
      token,
      refreshToken
    };

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to authenticate");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to authenticate.");
  }
};