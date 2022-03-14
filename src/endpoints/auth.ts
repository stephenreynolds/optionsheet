import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getRefreshToken, getUserByEmail, getUserByName, removeRefreshToken } from "../data/typeormDatabase";
import { logError, sendError } from "../errorResponse";

export const authenticate = async (request: Request, response: Response) => {
  try {
    const username = request.body.username;
    const email = request.body.email;
    const password = request.body.password;

    let user;

    if (username) {
      user = await getUserByName(username);
    }
    else if (email) {
      user = await getUserByEmail(email);
    }
    else {
      return sendError(request, response, StatusCodes.BAD_REQUEST, "Need username or email to authenticate.");
    }

    if (!user) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsValid) {
      return sendError(request, response, StatusCodes.UNAUTHORIZED, "Incorrect password.");
    }

    const token = await user.createToken();
    const refreshToken = await user.createRefreshToken();

    response.status(StatusCodes.OK).send({ token, refreshToken });
  }
  catch (error) {
    const message = "Failed to authenticate";
    logError(error, message);
    return sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

export const refreshToken = async (request: Request, response: Response) => {
  try {
    if (!request.body.refreshToken) {
      sendError(request, response, StatusCodes.FORBIDDEN, "Refresh token not provided");
      return;
    }

    const refreshToken = await getRefreshToken(request.body.refreshToken);
    if (!refreshToken) {
      sendError(request, response, StatusCodes.FORBIDDEN, "Refresh token invalid");
      return;
    }

    if (refreshToken.expired) {
      await removeRefreshToken(refreshToken);
      sendError(request, response, StatusCodes.FORBIDDEN, "Refresh token is expired");
      return;
    }

    const user = refreshToken.user;
    const newToken = await user.createToken();
    response.send({ token: newToken, refreshToken: refreshToken.token });
  }
  catch (error) {
    const message = "Failed to refresh token";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

export const emailAndUsernameAvailable = async (request: Request, response: Response) => {
  try {
    let available = true;

    if (request.query.email) {
      const email = request.query.email.toString();
      const userWithEmail = await getUserByEmail(email);
      available = !userWithEmail;
    }

    if (request.query.username) {
      const username = request.query.username.toString();
      const userWithName = await getUserByName(username);
      available = !userWithName;
    }

    response.send({ available });
  }
  catch (error) {
    const message = "Failed to check if email and username are available";
    logError(error, message);
    return sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};