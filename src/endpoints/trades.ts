import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logError, sendError } from "../error";
import Request from "../request";

// GET /projects/:username/:project/trades
export const getTrades = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const username = request.params.username;
    const user = await dataService.getUserByName(username);

    if (!user) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "User does not exist.");
      return;
    }

    const projectName = request.params.project;
    const project = await dataService.getProject(user.id, projectName);

    if (!project) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "Project does not exist");
      return;
    }

    const trades = await dataService.getTradesByProject(project);

    response.send(trades.map((trade) => {
      return {
        ...trade,
        legs: trade.legs.map((leg) => {
          return {
            ...leg,
            quantity: Number(leg.quantity),
            strike: Number(leg.strike),
            openPrice: Number(leg.openPrice),
            closePrice: leg.closePrice ? Number(leg.closePrice) : null
          };
        })
      };
    }));
  }
  catch (error) {
    const message = "Failed to get trades";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

// GET /trades/:id
export const getTrade = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const id = Number(request.params.id);
    const trade = await dataService.getTradeById(id);

    if (!trade) {
      sendError(request, response, StatusCodes.NOT_FOUND, "That trade does not exist.");
      return;
    }

    response.send({
      ...trade,
      legs: trade.legs.map((leg) => {
        return {
          ...leg,
          quantity: Number(leg.quantity),
          strike: Number(leg.strike),
          openPrice: Number(leg.openPrice),
          closePrice: leg.closePrice ? Number(leg.closePrice) : null
        };
      })
    });
  }
  catch (error) {
    const message = "Failed to get trade by id";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

// POST /projects/:username/:project
export const addTrade = async (request: Request, response: Response) => {
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

  const { symbol, openDate, legs } = request.body;

  if (!(symbol && openDate && legs && legs.length > 0 && legs[0].side && legs[0].quantity && legs[0].openPrice >= 0)) {
    sendError(request, response, StatusCodes.BAD_REQUEST, "A trade was not provided.");
    return;
  }

  try {
    const legs = request.body.legs;

    const trade = {
      ...request.body,
      legs,
      project
    };
    await dataService.saveTrade(trade);

    await dataService.onProjectUpdated(project);

    response.sendStatus(StatusCodes.CREATED);
  }
  catch (error) {
    const message = "Failed to add trade";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

// PATCH /trades/:id
export const updateTradeById = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const id = Number(request.params.id);

    let trade = await dataService.getTradeById(id);

    if (!trade) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "That trade does not exist.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...updatedTrade } = request.body;

    const project = await dataService.getProjectById(trade.projectId);
    const tradeUser = await dataService.getUserById(project.userId);
    if (userId !== tradeUser.id) {
      return sendError(request, response, StatusCodes.FORBIDDEN, "Forbidden.");
    }

    trade = {
      ...trade,
      ...updatedTrade
    };

    await dataService.saveTrade(trade);

    await dataService.onProjectUpdated(project);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    const message = "Failed to update trade";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

// DELETE /trades/:id
export const deleteTradeById = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const id = Number(request.params.id);
    const trade = await dataService.getTradeById(id);

    if (!trade) {
      response.sendStatus(StatusCodes.NO_CONTENT);
      return;
    }

    const project = await dataService.getProjectById(trade.projectId);
    const tradeUser = await dataService.getUserById(project.userId);
    const userId = request.body.userId;
    if (tradeUser.id !== userId) {
      return sendError(request, response, StatusCodes.FORBIDDEN, "Forbidden.");
    }

    await dataService.deleteTrade(id);

    await dataService.onProjectUpdated(project);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    const message = "Failed to delete trade";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};