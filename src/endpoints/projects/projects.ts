import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import { ProjectCreateModel, ProjectUpdateModel } from "../../data/models/project";
import { logError, sendError } from "../../error";
import Request from "../../request";
import { CreateProjectDto, GetProjectDto } from "./projectDtos";

// GET /projects/:username
export const getProjects = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const { username } = request.params;

    const user = await dataService.users.getUserByUsername(username);
    if (!user) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    }

    const projects = await dataService.projects.getUserProjects(user.uuid);
    const pinnedProjectIds = await dataService.users.getPinnedProjects(user.uuid);

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
          tags: tags.map((t) => t.name) ?? undefined,
          pinned: _.some(pinnedProjectIds, (id) => id === project.id)
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
    const dataService = request.dataService;
    const { username, project: projectName } = request.params;

    const user = await dataService.users.getUserByUsername(username);
    if (!user) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    }

    const project = await dataService.projects.getProjectByName(user.uuid, projectName);
    if (!project) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not have a project with that name.");
    }

    const tags = await dataService.projects.getProjectTags(project.id);

    const res: GetProjectDto = {
      id: project.id,
      name: project.name,
      username: user.username,
      description: project.description ?? undefined,
      starting_balance: Number(project.starting_balance) ?? undefined,
      risk: Number(project.risk) ?? undefined,
      created_on: new Date(project.created_on),
      updated_on: new Date(project.updated_on),
      tags: tags.map((t) => t.name) ?? undefined
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
    const dataService = request.dataService;

    // Check that the user does not already have a project with that name.
    const existingProject = await dataService.projects.getProjectByName(userUUID, name);
    if (existingProject) {
      return sendError(request, response, StatusCodes.BAD_REQUEST, "A project with that name already exists.");
    }

    const model: ProjectCreateModel = {
      name,
      description: request.body.description.trim(),
      starting_balance: request.body.starting_balance,
      tags: request.body.tags
    };

    await dataService.projects.addProject(userUUID, model);

    const { username } = await dataService.users.getUserByUUID(userUUID);
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
    const dataService = request.dataService;
    const { username, project: projectName } = request.params;

    const user = await dataService.users.getUserByUsername(username);
    if (!user) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    }

    const { userUUID, ...newData } = request.body;
    if (userUUID !== user.uuid) {
      return sendError(request, response, StatusCodes.FORBIDDEN, "Forbidden.");
    }

    const project = await dataService.projects.getProjectByName(user.uuid, projectName);
    if (!project) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not have a project with that name.");
    }

    const model: ProjectUpdateModel = {
      name: newData.name,
      description: newData.description,
      starting_balance: newData.starting_balance,
      risk: newData.starting_balance
    };

    await dataService.projects.updateProject(project.id, model);

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
    const dataService = request.dataService;
    const { userUUID } = request.body;
    const { username, project: projectName } = request.params;

    const user = await dataService.users.getUserByUsername(username);
    if (user) {
      if (userUUID !== user.uuid) {
        return sendError(request, response, StatusCodes.FORBIDDEN, "Forbidden.");
      }

      const project = await dataService.projects.getProjectByName(user.uuid, projectName);
      if (project) {
        await dataService.projects.deleteProject(project.id);
      }
    }

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    logError(error, "Failed to delete project");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete project.");
  }
};