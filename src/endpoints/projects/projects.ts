import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ProjectCreateModel } from "../../data/models/project";
import { logError, sendError } from "../../error";
import Request from "../../request";
import { CreateProjectDto, GetProjectDto } from "./projectDtos";

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
      startingBalance: request.body.startingBalance,
      tags: request.body.tags
    };

    await dataService.projects.addProject(userUUID, model);

    const { username } = await dataService.users.getUserByUUID(userUUID);
    const res: CreateProjectDto = {
      projectUrl: `/${username}/${encodeURIComponent(name)}`
    };

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to create project");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create project.");
  }
};

// GET /projects/:username
export const getProjects = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const { username } = request.params;

    const user = await dataService.users.getUserByUsername(username);
    if (!user) {
      return sendError(request, response, StatusCodes.BAD_REQUEST, "User does not exist.");
    }

    const projects = await dataService.projects.getUserProjects(user.uuid);

    const res: GetProjectDto[] = await Promise.all(projects.map(async (project) => {
      const tags = await dataService.projects.getProjectTags(project.id);

      return {
        name: project.name,
        username: user.username,
        description: project.description ?? undefined,
        startingBalance: project.starting_balance ?? undefined,
        risk: project.risk ?? undefined,
        createdOn: new Date(project.created_on),
        lastEdited: new Date(project.updated_on),
        tags: tags.map((t) => t.name) ?? undefined
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
      return sendError(request, response, StatusCodes.BAD_REQUEST, "User does not exist.");
    }

    const project = await dataService.projects.getProjectByName(user.uuid, projectName);
    if (!project) {
      return sendError(request, response, StatusCodes.BAD_REQUEST, "User does not have a project with that name.");
    }

    const tags = await dataService.projects.getProjectTags(project.id);

    const res: GetProjectDto = {
      name: project.name,
      username: user.username,
      description: project.description ?? undefined,
      startingBalance: project.starting_balance ?? undefined,
      risk: project.risk ?? undefined,
      createdOn: new Date(project.created_on),
      lastEdited: new Date(project.updated_on),
      tags: tags.map((t) => t.name) ?? undefined
    };

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to get project by name");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get project by name.");
  }
};