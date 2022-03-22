import bcrypt from "bcrypt";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logError, sendError } from "../../error";
import Request from "../../request";
import { AuthTokenDto, AvailableDto } from "./authDtos";

// POST /auth
export const authenticate = async (request: Request, response: Response) => {
  try {
    const username = request.body.username;
    const email = request.body.email;
    const password = request.body.password;

    let user;

    const dataService = request.dataService;
    if (username) {
      user = await dataService.getUserByName(username);
    }
    else if (email) {
      user = await dataService.getUserByEmail(email);
    }
    else {
      return sendError(request, response, StatusCodes.BAD_REQUEST, "Need username or email to authenticate.");
    }

    if (!password) {
      return sendError(request, response, StatusCodes.BAD_REQUEST, "Need password to authenticate.");
    }

    if (!user) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsValid) {
      return sendError(request, response, StatusCodes.UNAUTHORIZED, "Incorrect password.");
    }

    const token = await dataService.createToken(user);
    const refreshToken = await dataService.createRefreshToken(user);

    const dto: AuthTokenDto = {
      token,
      refreshToken
    };

    response.status(StatusCodes.OK).send(dto);
  }
  catch (error) {
    const message = "Failed to authenticate";
    logError(error, message);
    return sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

// POST /auth/refresh
export const refreshToken = async (request: Request, response: Response) => {
  try {
    if (!request.body.refreshToken) {
      sendError(request, response, StatusCodes.FORBIDDEN, "Refresh token not provided");
      return;
    }

    const dataService = request.dataService;

    const refreshToken = await dataService.getRefreshToken(request.body.refreshToken);
    if (!refreshToken) {
      sendError(request, response, StatusCodes.FORBIDDEN, "Refresh token invalid");
      return;
    }

    if (refreshToken.expired) {
      await dataService.removeRefreshToken(refreshToken);
      sendError(request, response, StatusCodes.FORBIDDEN, "Refresh token is expired");
      return;
    }

    const user = refreshToken.user;
    const newToken = await dataService.createToken(user);

    const dto: AuthTokenDto = {
      token: newToken,
      refreshToken: refreshToken.token
    };

    response.send(dto);
  }
  catch (error) {
    const message = "Failed to refresh token";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

// GET /auth/check-credentials
export const emailAndUsernameAvailable = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    let available = true;

    if (request.query.email) {
      const email = request.query.email.toString();
      const userWithEmail = await dataService.getUserByEmail(email);
      available = !userWithEmail;
    }

    if (request.query.username) {
      const username = request.query.username.toString();
      const userWithName = await dataService.getUserByName(username);
      available = !userWithName;
    }

    const dto: AvailableDto = {
      available
    };

    response.send(dto);
  }
  catch (error) {
    const message = "Failed to check if email and username are available";
    logError(error, message);
    return sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};