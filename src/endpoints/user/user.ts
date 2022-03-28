import bcrypt from "bcrypt";
import { Response } from "express";
import * as fs from "fs";
import { StatusCodes } from "http-status-codes";
import * as path from "path";
import { UserUpdateModel } from "../../data/models/user";
import { logError, sendError } from "../../error";
import Request from "../../request";
import { GetProjectDto } from "../projects/projectDtos";
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

// PATCH /user
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
    const { password, confirm, current_password } = request.body;
    if (password) {
      if (password !== confirm) {
        return sendError(request, response, StatusCodes.BAD_REQUEST, "Password and confirm password do not match.");
      }

      if (!current_password) {
        return sendError(request, response, StatusCodes.BAD_REQUEST, "Current password required.");
      }

      const validated = await bcrypt.compare(current_password, user.password_hash);
      if (!validated) {
        return sendError(request, response, StatusCodes.UNAUTHORIZED, "Incorrect password.");
      }

      if (!passwordIsValid(password)) {
        return sendError(request, response, StatusCodes.BAD_REQUEST, "Password is too weak.");
      }

      const password_hash = await bcrypt.hash(password, 12);
      updateModel = { ...updateModel, password_hash };
    }

    // Change bio if given.
    const bio = request.body.bio;
    if (typeof bio === "string") {
      updateModel = { ...updateModel, bio };
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

// DELETE /user
export const deleteUser = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const userUUID = request.body.userUUID;

    await dataService.users.deleteUser(userUUID);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    logError(error, "Failed to delete user");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete user.");
  }
};

// POST /user/avatar
export const setAvatar = async (request: Request, response: Response) => {
  try {
    const userUUID = request.body.userUUID;
    const file = request.file;
    const dataService = request.dataService;
    const avatar_url = `uploads/images/${file.filename}`;

    const { avatar_url: old_avatar_url } = await dataService.users.getUserByUUID(userUUID);
    fs.unlink(path.resolve(__dirname, old_avatar_url), (error) => {
      if (error) {
        throw new Error(`Failed to delete avatar image at ${old_avatar_url}: ${error.message}`);
      }
    });

    await dataService.users.updateUser(userUUID, { avatar_url });

    response.send({ avatar_url });
  }
  catch (error) {
    logError(error, "Failed to set profile picture");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to set profile picture.");
  }
};

// GET /user/starred
export const getStarredProjects = async (request: Request, response: Response) => {
  try {
    const userUUID = request.body.userUUID;
    const dataService = request.dataService;

    const user = await dataService.users.getUserByUUID(userUUID);
    const projects = await dataService.users.getStarredProjects(userUUID);

    const res: GetProjectDto[] = await Promise.all(
      projects.map(async (project) => {
        const tags = await dataService.projects.getProjectTags(project.id);
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

// GET /user/starred/:owner/:project
export const isProjectStarred = async (request: Request, response: Response) => {
  try {
    const { owner: ownerUsername, project: projectName } = request.params;
    const dataService = request.dataService;

    const owner = await dataService.users.getUserByUsername(ownerUsername);
    if (!owner) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    }

    const project = await dataService.projects.getProjectByName(owner.uuid, projectName);
    if (!project) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not have a project with that name.");
    }

    const userUUID = request.body.userUUID;
    const starredProject = await dataService.users.getStarredProject(userUUID, project.id);
    if (!starredProject) {
      return response.sendStatus(StatusCodes.NOT_FOUND);
    }

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    logError(error, "Failed to check if project is starred by user");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to check if project is starred.");
  }
};

// PUT /user/starred/:owner/:project
export const starProject = async (request: Request, response: Response) => {
  try {
    const { owner: ownerUsername, project: projectName } = request.params;
    const dataService = request.dataService;

    const owner = await dataService.users.getUserByUsername(ownerUsername);
    if (!owner) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    }

    const project = await dataService.projects.getProjectByName(owner.uuid, projectName);
    if (!project) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not have a project with that name.");
    }

    const userUUID = request.body.userUUID;
    await dataService.users.starProject(userUUID, project.id);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    logError(error, "Failed to star project");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to star project.");
  }
};

// DELETE /user/starred/:owner/:project
export const unStarProject = async (request: Request, response: Response) => {
  try {
    const { owner: ownerUsername, project: projectName } = request.params;
    const dataService = request.dataService;

    const owner = await dataService.users.getUserByUsername(ownerUsername);

    if (owner) {
      const project = await dataService.projects.getProjectByName(owner.uuid, projectName);
      if (project) {
        const userUUID = request.body.userUUID;
        await dataService.users.unStarProject(userUUID, project.id);
      }
    }

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    logError(error, "Failed to un-star project");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to un-star project.");
  }
};

// PUT /user/pinned
export const setPinnedProjects = async (request: Request, response: Response) => {
  try {
    const userUUID = request.body.userUUID;
    const projectIds = request.body.projectIds;
    const dataService = request.dataService;

    // Check that each project exists.
    for (const id of projectIds) {
      const project = await dataService.projects.getProjectById(id);
      if (!project) {
        return sendError(request, response, StatusCodes.NOT_FOUND, "At least one of the projects does not exist.");
      }
    }

    const res: number[] = await dataService.users.setPinnedProjects(userUUID, projectIds);

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to add pinned project");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to add pinned project.");
  }
};