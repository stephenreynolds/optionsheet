import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logError, sendError } from "../error";
import Request from "../request";

// GET /projects/:username
export const getProjects = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const username = request.params.username;
    const user = await request.dataService.getUserByName(username);

    if (!user) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "User does not exist.");
      return;
    }

    const projects = await dataService.getProjectsByUserId(user.id);

    const res = projects.map((project) => {
      return {
        name: project.name,
        description: project.description,
        tags: project.tags,
        lastEdited: new Date(project.lastEdited),
        username: project.user.username
      };
    });

    response.send(res);
  }
  catch (error) {
    const message = "Failed to get projects";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

// GET /projects/:username/:project
export const getProjectByName = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const username = request.params.username;
    const projectName = request.params.project;

    const user = await dataService.getUserByName(username);
    if (!user) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "User does not exist.");
      return;
    }

    const project = await dataService.getProject(user.id, projectName);
    if (!project) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "User does not have a project with that name.");
      return;
    }

    const res = {
      name: project.name,
      description: project.description,
      startingBalance: project.startingBalance ? Number(project.startingBalance) : null,
      tags: project.tags,
      lastEdited: new Date(project.lastEdited),
      risk: project.risk ? Number(project.risk) : null
    };

    response.send(res);
  }
  catch (error) {
    const message = "Failed to get project by name";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

// POST /projects
export const createProject = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    let name = request.body.name;
    const description = request.body.description;
    const startingBalance = request.body.startingBalance;
    const tags = request.body.tags;
    const userId = request.body.userId;

    // Check that the user does not already have a project with this name.
    const projectExists = await dataService.getProject(userId, name);
    if (projectExists) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "A project with that name already exists.");
      return;
    }

    // Trim whitespace from name.
    name = name.trim();

    const project = {
      name,
      description,
      startingBalance: startingBalance ? startingBalance : null,
      tags,
      user: userId,
      lastEdited: new Date()
    };

    dataService.saveProject(project)
      .then(async () => {
        const user = await dataService.getUserById(userId);
        response.send({
          projectUrl: `/${user.username}/${project.name}`
        });
      })
      .catch((error) => {
        throw error;
      });
  }
  catch (error) {
    const message = "Failed to create project";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

// PATCH /projects/:username/:project
export const updateProject = async (request: Request, response: Response) => {
  const dataService = request.dataService;
  const username = request.params.username;
  const projectName = request.params.project;

  const user = await dataService.getUserByName(username);
  if (!user) {
    sendError(request, response, StatusCodes.BAD_REQUEST, "User does not exist.");
    return;
  }

  const project = await dataService.getProject(user.id, projectName);
  if (!project) {
    sendError(request, response, StatusCodes.BAD_REQUEST, "User does not have a project with that name.");
    return;
  }

  try {
    delete request.body.userId;
    const updatedData = request.body;

    const updatedProject = {
      ...project,
      ...updatedData
    };

    await dataService.saveProject(updatedProject);

    await dataService.onProjectUpdated(project);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    const message = "Failed to update project";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

// DELETE /projects/:username/:project
export const deleteProjectByName = async (request: Request, response: Response) => {
  const dataService = request.dataService;
  const username = request.params.username;
  const projectName = request.params.project;

  const user = await dataService.getUserByName(username);
  if (!user) {
    sendError(request, response, StatusCodes.BAD_REQUEST, "User does not exist.");
    return;
  }

  try {
    const project = await dataService.getProject(user.id, projectName);
    await request.dataService.deleteProject(project);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    const message = "Failed to delete project";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};