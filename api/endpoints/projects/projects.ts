import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import { ProjectCreateModel, ProjectUpdateModel } from "../../data/models/project";
import { logError, sendError } from "../../error";
import { CreateProjectDto, GetProjectDto } from "./projectDtos";
import { Database } from "../../data/database";

// GET /projects/:username
export const getProjects = async (request: Request, response: Response) => {
  try {
    const { username } = request.params;

    const user = await Database.users.getUserByUsername(username);
    if (!user) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    }

    const projects = await Database.projects.getUserProjects(user.uuid);
    const pinnedProjectIds = await Database.users.getPinnedProjects(user.uuid);

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
          tags: tags.map((t) => t.name) ?? undefined,
          pinned: _.some(pinnedProjectIds, (id) => id === project.id),
          stars: Number(project.stars)
        };
      }));

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to get user's projects");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get projects.");
  }
};

// GET /projects/:username/:project
export const getProjectByName = async (request: Request, response: Response) => {
  try {
    const { username, project: projectName } = request.params;

    const user = await Database.users.getUserByUsername(username);
    if (!user) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    }

    const project = await Database.projects.getProjectByName(user.uuid, projectName);
    if (!project) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not have a project with that name.");
    }

    const pinnedProjectIds = await Database.users.getPinnedProjects(user.uuid);
    const tags = await Database.projects.getProjectTags(project.id);

    const res: GetProjectDto = {
      id: project.id,
      name: project.name,
      username: user.username,
      description: project.description ?? undefined,
      starting_balance: project.starting_balance ? parseFloat(project.starting_balance) : undefined,
      risk: project.risk ? parseFloat(project.risk) : undefined,
      created_on: project.created_on,
      updated_on: project.updated_on,
      tags: tags.map((t) => t.name) ?? undefined,
      pinned: _.some(pinnedProjectIds, (id) => id === project.id),
      stars: parseInt(project.stars)
    };

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to get project by name");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get project by name.");
  }
};

// POST /projects
export const createProject = async (request: Request, response: Response) => {
  try {
    const userUUID = request.body.userUUID;
    const name = request.body.name.trim();

    // Check that the user does not already have a project with that name.
    const existingProject = await Database.projects.getProjectByName(userUUID, name);
    if (existingProject) {
      return sendError(request, response, StatusCodes.BAD_REQUEST, "A project with that name already exists.");
    }

    const model: ProjectCreateModel = {
      name,
      description: request.body.description.trim(),
      starting_balance: request.body.starting_balance,
      tags: request.body.tags
    };

    await Database.projects.addProject(userUUID, model);

    const { username } = await Database.users.getUserByUUID(userUUID);
    const res: CreateProjectDto = {
      project_url: `/${username}/${encodeURIComponent(name)}`
    };

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to create project");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create project.");
  }
};

// PATCH /projects/:username/:project
export const updateProject = async (request: Request, response: Response) => {
  try {
    const { username, project: projectName } = request.params;

    const user = await Database.users.getUserByUsername(username);
    if (!user) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    }

    const { userUUID, ...newData } = request.body;
    if (userUUID !== user.uuid) {
      return sendError(request, response, StatusCodes.FORBIDDEN, "Forbidden.");
    }

    const project = await Database.projects.getProjectByName(user.uuid, projectName);
    if (!project) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not have a project with that name.");
    }

    const model: ProjectUpdateModel = {
      name: newData.name,
      description: newData.description,
      starting_balance: newData.starting_balance,
      risk: newData.starting_balance
    };

    await Database.projects.updateProject(project.id, model);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    logError(error, "Failed to update project");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update project.");
  }
};

// DELETE /projects/:username/:project
export const deleteProject = async (request: Request, response: Response) => {
  try {
    const { userUUID } = request.body;
    const { username, project: projectName } = request.params;

    const user = await Database.users.getUserByUsername(username);
    if (user) {
      if (userUUID !== user.uuid) {
        return sendError(request, response, StatusCodes.FORBIDDEN, "Forbidden.");
      }

      const project = await Database.projects.getProjectByName(user.uuid, projectName);
      if (project) {
        await Database.projects.deleteProject(project.id);
      }
    }

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    logError(error, "Failed to delete project");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete project.");
  }
};