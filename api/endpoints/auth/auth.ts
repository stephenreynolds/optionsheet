import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logError, sendError } from "../../error";
import { AuthTokenDto } from "./authDtos";
import { Database } from "../../data/database";

// POST /auth
export const authenticate = async (request: Request, response: Response) => {
  try {
    const { username, email, password } = request.body;

    let user;

    if (username) {
      user = await Database.users.getUserByUsername(username);
    }
    else if (email) {
      user = await Database.users.getUserByEmail(email);
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

    const token = await Database.users.createToken(user.uuid);
    const { refresh_token } = await Database.users.createRefreshToken(user.uuid);

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

    const { refresh_token, refresh_token_expiry } = await Database.users.getRefreshToken(request.body.refresh_token);
    if (!refresh_token) {
      return sendError(request, response, StatusCodes.FORBIDDEN, "Refresh token invalid.");
    }

    const expired = new Date(refresh_token_expiry).getTime() < new Date().getTime();
    if (expired) {
      return sendError(request, response, StatusCodes.FORBIDDEN, "Refresh token is expired.");
    }

    const newToken = await Database.users.createTokenFromRefreshToken(refresh_token);

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
    let usernameAvailable = true;
    let emailAvailable = true;

    if (request.query.username) {
      const username = request.query.username.toString();
      const userWithName = await Database.users.getUserByUsername(username);
      usernameAvailable = !userWithName;
    }

    if (request.query.email) {
      const email = request.query.email.toString();
      const userWithEmail = await Database.users.getUserByEmail(email);
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