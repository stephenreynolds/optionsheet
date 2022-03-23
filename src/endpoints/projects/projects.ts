import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ProjectCreateModel } from "../../data/models/project";
import { logError, sendError } from "../../error";
import Request from "../../request";
import { CreateProjectDto } from "./projectDtos";

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