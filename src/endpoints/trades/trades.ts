import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateTradeModel } from "../../data/models/trade";
import { logError, sendError } from "../../error";
import Request from "../../request";

// POST /projects/:username/:project
export const addTrade = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const { username, project: projectName } = request.params;
    const userUUID = request.body.userUUID;

    const user = await dataService.users.getUserByUsername(username);
    if (!user) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    }

    if (userUUID !== user.uuid) {
      return sendError(request, response, StatusCodes.FORBIDDEN, "Forbidden.");
    }

    const project = await dataService.projects.getProjectByName(user.uuid, projectName);
    if (!project) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not have a project with that name.");
    }

    const { symbol, openDate, openingNote, legs, tags } = request.body;

    if (!(symbol && openDate && legs && legs.length > 0 && legs[0].side && legs[0].quantity && legs[0].openPrice >= 0)) {
      return sendError(request, response, StatusCodes.BAD_REQUEST, "A trade was not provided.");
    }

    const model: CreateTradeModel = {
      symbol: symbol.toUpperCase(),
      openDate,
      openingNote: openingNote ?? undefined,
      legs,
      tags
    };

    await dataService.trades.addTrade(project.id, model);

    response.sendStatus(StatusCodes.CREATED);
  }
  catch (error) {
    logError(error, "Failed to add trade");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to add trade.");
  }
};