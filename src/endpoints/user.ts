import bcrypt from "bcrypt";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logError, sendError } from "../error";
import Request from "../request";

interface UserDetails {
  username: string;
  url: string;
  html_url: string;
  projects_url: string;
  email: string;
  avatar_url: string;
  bio: string;
  created_on: Date;
  updated_on: Date;
  is_admin: boolean;
}

const getUserDetails = (user): UserDetails => {
  const isAdmin = !!user.roles.find(role => role.name === "admin");

  return {
    username: user.username,
    url: `https://api.optionsheet.net/users/${user.username}`,
    html_url: `https://optionsheet.net/${user.username}`,
    projects_url: `https://optionsheet.net/${user.username}/projects`,
    email: user.email,
    avatar_url: user.avatarUrl,
    bio: user.bio,
    created_on: new Date(user.createdOn),
    updated_on: new Date(user.updatedOn),
    is_admin: isAdmin
  };
};

export const get = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const id = request.body.userId;
    const user = await dataService.getUserById(id);

    const userDetails = getUserDetails(user);

    response.status(StatusCodes.OK).send(userDetails);
  }
  catch (error) {
    const message = "Failed to get user";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

interface UserUpdateModel {
  username?: string;
  email?: string;
  bio?: string;
  passwordHash?: string;
}

const passwordIsValid = (password: string) => {
  const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
  return password.length >= 8 && passwordRegex.test(password);
};

const emailIsValid = (email: string) => {
  const emailRegex = /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"(\[]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/;
  return email.length <= 320 && emailRegex.test(email);
};

export const update = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const id = request.body.userId;

    let updateModel: UserUpdateModel = {};

    // Change username if given.
    const username = request.body.username;
    if (username) {
      // Check that no user already has that username.
      const match = await dataService.getUserByName(username);
      if (match) {
        sendError(request, response, StatusCodes.BAD_REQUEST, "That username is not available.");
        return;
      }

      updateModel = { ...updateModel, username };
    }

    // Change password if given.
    const password = request.body.password;
    if (password) {
      // Check for valid password.
      if (!passwordIsValid(password)) {
        sendError(request, response, StatusCodes.BAD_REQUEST, "Password is too weak.");
        return;
      }

      const passwordHash = await bcrypt.hash(password, 12);
      updateModel = { ...updateModel, passwordHash };
    }

    // Change email if given.
    const email = request.body.email;
    if (email) {
      // Check for valid email address.
      if (!emailIsValid(email)) {
        sendError(request, response, StatusCodes.BAD_REQUEST, "Email is invalid.");
        return;
      }

      // Check that no user already has that username.
      const match = await dataService.getUserByEmail(email);
      if (match) {
        sendError(request, response, StatusCodes.BAD_REQUEST, "That email address is not available.");
        return;
      }

      updateModel = { ...updateModel, email };
    }

    // Change bio if given.
    const bio = request.body.bio;
    if (bio) {
      updateModel = { ...updateModel, bio };
    }

    await dataService.updateUserById(id, updateModel);
    const updatedUser = await dataService.getUserById(id);

    const userDetails = getUserDetails(updatedUser);

    response.status(StatusCodes.OK).send(userDetails);
  }
  catch (error) {
    const message = "Failed to update user";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

export const deleteAccount = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const id = request.body.userId;

    await dataService.deleteUserById(id);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    const message = "Failed to delete user";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};