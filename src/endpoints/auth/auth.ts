import bcrypt from "bcrypt";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logError, sendError } from "../../error";
import Request from "../../request";
import { AuthTokenDto } from "./authDtos";

// POST /auth
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
    const { refresh_token } = await dataService.users.createRefreshToken(user.uuid);

    const res: AuthTokenDto = {
      token,
      refresh_token
    };

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to authenticate");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to authenticate.");
  }
};

// POST /auth/refresh
export const refreshToken = async (request: Request, response: Response) => {
  try {
    if (!request.body.refresh_token) {
      return sendError(request, response, StatusCodes.FORBIDDEN, "Refresh token not provided.");
    }

    const dataService = request.dataService;

    const { refresh_token, refresh_token_expiry } = await dataService.users.getRefreshToken(request.body.refreshToken);
    if (!refresh_token) {
      return sendError(request, response, StatusCodes.FORBIDDEN, "Refresh token invalid.");
    }

    const expired = new Date(refresh_token_expiry).getTime() < new Date().getTime();
    if (expired) {
      return sendError(request, response, StatusCodes.FORBIDDEN, "Refresh token is expired.");
    }

    const newToken = await dataService.users.createTokenFromRefreshToken(refresh_token);

    const res: AuthTokenDto = {
      token: newToken,
      refresh_token
    };

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to refresh token");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to refresh token.");
  }
};

// GET /auth/check-credentials
export const emailAndUsernameAvailable = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    let usernameAvailable = true;
    let emailAvailable = true;

    if (request.query.username) {
      const username = request.query.username.toString();
      const userWithName = await dataService.users.getUserByUsername(username);
      usernameAvailable = !userWithName;
    }

    if (request.query.email) {
      const email = request.query.email.toString();
      const userWithEmail = await dataService.users.getUserByEmail(email);
      emailAvailable = !userWithEmail;
    }

    if (usernameAvailable && emailAvailable) {
      response.sendStatus(StatusCodes.NO_CONTENT)
    }
    else {
      response.sendStatus(StatusCodes.BAD_REQUEST)
    }
  }
  catch (error) {
    logError(error, "Failed to check if email and username are available");
    return sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to check if email and username are available.");
  }
};