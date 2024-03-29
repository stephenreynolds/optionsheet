import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserCreateModel } from "../../data/models/user";
import { logError, sendError } from "../../error";
import { GetProjectDto } from "../projects/projectDtos";
import { AuthTokenDto, GetUserDto } from "./usersDtos";
import { Database } from "../../data/database";

export const getUserDetails = async (user): Promise<GetUserDto> => {
  const roles = await Database.users.getUserRoles(user.uuid);
  const isAdmin = roles.filter((role) => role.name === "admin").length > 0;

  return {
    username: user.username,
    url: `https://api.optionsheet.net/users/${user.username}`,
    html_url: `https://optionsheet.net/${user.username}`,
    projects_url: `https://optionsheet.net/${user.username}/projects`,
    email: user.email,
    avatar_url: user.avatar_url,
    bio: user.bio,
    created_on: user.created_on,
    updated_on: user.updated_on,
    is_admin: isAdmin
  };
};

const emailIsValid = (email: string) => {
  const emailRegex = /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"(\[]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/;
  return email.length < 255 && emailRegex.test(email);
};

const passwordIsValid = (password: string) => {
  const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
  return passwordRegex.test(password);
};

// POST /users
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

    // Check that username and email address are not in use.
    let existingUser = await Database.users.getUserByUsername(username);
    if (existingUser) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "A user with that username already exists.");
      return;
    }
    existingUser = await Database.users.getUserByEmail(email);
    if (existingUser) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "A user with that email address already exists.");
      return;
    }

    // Save the new user to the database.
    const createModel: UserCreateModel = {
      username,
      email,
      password_hash: await bcrypt.hash(password, 12)
    };
    const { uuid } = await Database.users.addUser(createModel);

    // Assign user role.
    const role = await Database.users.getRoleByName("user");
    await Database.users.addUserRole(uuid, role.id);

    // Create auth tokens.
    const token = await Database.users.createToken(uuid);
    const { refresh_token: refreshToken } = await Database.users.createRefreshToken(uuid);

    const res: AuthTokenDto = {
      token,
      refreshToken
    };

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to create user");
    sendError(request, response, error, "Failed to create user.");
  }
};

// GET /users/:username
export const getUser = async (request: Request, response: Response) => {
  try {
    const { username } = request.params;
    const user = await Database.users.getUserByUsername(username);

    if (!user) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    }

    const res = await getUserDetails(user);

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to get user");
    sendError(request, response, error, "Failed to create user.");
  }
};

// GET /users/:username/starred
export const getStarredProjects = async (request: Request, response: Response) => {
  try {
    const { username } = request.params;

    const user = await Database.users.getUserByUsername(username);
    const projects = await Database.users.getStarredProjects(user.uuid);

    const res: GetProjectDto[] = await Promise.all(
      projects.map(async (project) => {
        const tags = await Database.projects.getProjectTags(project.id);
        return {
          id: project.id,
          name: project.name,
          username: user.username,
          description: project.description ?? undefined,
          starting_balance: project.starting_balance ?? undefined,
          risk: project.risk ?? undefined,
          created_on: new Date(project.created_on),
          updated_on: new Date(project.updated_on),
          tags: tags.map((t) => t.name) ?? undefined
        };
      }));

    return response.send(res);
  }
  catch (error) {
    logError(error, "Failed to get starred projects");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get starred projects.");
  }
};

// GET /users/:username/pinned
export const getPinnedProjects = async (request: Request, response: Response) => {
  try {
    const { username } = request.params;

    const user = await Database.users.getUserByUsername(username);
    const projectIds = await Database.users.getPinnedProjects(user.uuid);

    const res: GetProjectDto[] = await Promise.all(
      projectIds.map(async (id) => {
        const project = await Database.projects.getProjectById(id);
        const tags = await Database.projects.getProjectTags(project.id);
        return {
          id: project.id,
          name: project.name,
          username: user.username,
          description: project.description ?? undefined,
          starting_balance: project.starting_balance ?? undefined,
          risk: project.risk ?? undefined,
          created_on: new Date(project.created_on),
          updated_on: new Date(project.updated_on),
          tags: tags.map((t) => t.name) ?? undefined,
          pinned: true,
          stars: Number(project.stars)
        };
      }));

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to get pinned projects");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get pinned projects.");
  }
};