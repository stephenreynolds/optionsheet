import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  deleteTrade,
  getProject,
  getTradeById,
  getTradesByProject,
  getTradeWithProject,
  getUserByName,
  onProjectUpdated,
  saveTrade
} from "../data/typeormDatabase";
import { logError, sendError } from "../errorResponse";

// GET /projects/:username/:project/trades
export const getTrades = async (request: Request, response: Response) => {
  try {
    const username = request.params.username;
    const user = await getUserByName(username);

    if (!user) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "User does not exist.");
      return;
    }

    const projectName = request.params.project;
    const project = await getProject(user.id, projectName);

    if (!project) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "Project does not exist");
      return;
    }

    const trades = await getTradesByProject(project);

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
    const id = Number(request.params.id);
    const trade = await getTradeById(id);

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
  const username = request.params.username;
  const projectName = request.params.project;

  const user = await getUserByName(username);
  if (!user) {
    sendError(request, response, StatusCodes.BAD_REQUEST, "User does not exist.");
    return;
  }

  const project = await getProject(user.id, projectName);
  if (!project) {
    sendError(request, response, StatusCodes.BAD_REQUEST, "User does not have a project with that name.");
    return;
  }

  try {
    const legs = request.body.legs;

    const trade = {
      ...request.body,
      legs,
      project
    };
    await saveTrade(trade);

    await onProjectUpdated(project);

    response.sendStatus(StatusCodes.CREATED);
  }
  catch (error) {
    console.log(error.message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to add trade.");
  }
};

// PATCH /trades/:id
export const updateTradeById = async (request: Request, response: Response) => {
  const id = Number(request.params.id);
  let trade = await getTradeWithProject(id);
  console.log(trade);

  if (!trade) {
    sendError(request, response, StatusCodes.NOT_FOUND, "That trade does not exist.");
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...updatedTrade } = request.body;

    trade = {
      ...trade,
      ...updatedTrade
    };

    await saveTrade(trade);

    await onProjectUpdated(trade.project);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    console.log(error.message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update trade.");
  }
};

// DELETE /trades/:id
export const deleteTradeById = async (request: Request, response: Response) => {
  const id = Number(request.params.id);
  const trade = await getTradeWithProject(id);

  try {
    await deleteTrade(id);

    await onProjectUpdated(trade.project);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    console.log(error.message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete trade.");
  }
};