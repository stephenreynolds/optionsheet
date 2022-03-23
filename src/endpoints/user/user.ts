import bcrypt from "bcrypt";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserUpdateModel } from "../../data/models/user";
import { logError, sendError } from "../../error";
import Request from "../../request";
import { getUserDetails } from "../users/users";

const emailIsValid = (email: string) => {
  const emailRegex = /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"(\[]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/;
  return email.length < 255 && emailRegex.test(email);
};

const passwordIsValid = (password: string) => {
  const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
  return passwordRegex.test(password);
};

// GET /user
export const get = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const { userUUID } = request.body;
    const user = await dataService.users.getUserByUUID(userUUID);

    const res = await getUserDetails(user, dataService);

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to get authenticated user");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get authenticated user.");
  }
};

// PATH /user
export const update = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const userUUID = request.body.userUUID;
    const user = await dataService.users.getUserByUUID(userUUID);

    let updateModel: UserUpdateModel = {};

    // Change username if given.
    const username = request.body.username;
    if (username) {
      // Check that no user already has that username.
      const match = await dataService.users.getUserByUsername(username);
      if (match) {
        return sendError(request, response, StatusCodes.BAD_REQUEST, "That username is not available.");
      }
      updateModel = { ...updateModel, username };
    }

    // Change email if given.
    const email = request.body.email;
    if (email) {
      // Check for valid email address.
      if (!emailIsValid(email)) {
        return sendError(request, response, StatusCodes.BAD_REQUEST, "Email is invalid.");
      }

      // Check that no user already has that email.
      const match = await dataService.users.getUserByEmail(email);
      if (match) {
        return sendError(request, response, StatusCodes.BAD_REQUEST, "That email address is not available.");
      }

      updateModel = { ...updateModel, email };
    }

    // Change password if given.
    const { password, confirm, currentPassword } = request.body;
    if (password) {
      if (password !== confirm) {
        return sendError(request, response, StatusCodes.BAD_REQUEST, "Password and confirm password do not match.");
      }

      if (!currentPassword) {
        return sendError(request, response, StatusCodes.BAD_REQUEST, "Current password required.");
      }

      const validated = await bcrypt.compare(currentPassword, user.password_hash);
      if (!validated) {
        return sendError(request, response, StatusCodes.UNAUTHORIZED, "Incorrect password.");
      }

      if (!passwordIsValid(password)) {
        return sendError(request, response, StatusCodes.BAD_REQUEST, "Password is too weak.");
      }

      const passwordHash = await bcrypt.hash(password, 12);
      updateModel = { ...updateModel, passwordHash };
    }

    // Change bio if given.
    const bio = request.body.bio;
    if (bio) {
      updateModel = { ...updateModel, bio };
    }

    // Change avatar url if given.
    const avatarUrl = request.body.avatarUrl;
    if (avatarUrl) {
      updateModel = { ...updateModel, avatarUrl };
    }

    const updatedUser = await dataService.users.updateUser(userUUID, updateModel);
    const res = await getUserDetails(updatedUser, dataService);

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to update user");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update user.");
  }
};