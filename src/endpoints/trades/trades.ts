import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateTradeModel, TradeUpdateModel } from "../../data/models/trade";
import { logError, sendError } from "../../error";
import Request from "../../request";
import { GetTradeDto } from "./tradeDtos";
import { Database } from "../../data/database";

// GET /projects/:username/:project/trades
export const getTrades = async (request: Request, response: Response) => {
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

    const trades = await Database.trades.getTradesByProject(project.id);

    const res: GetTradeDto[] = await Promise.all(
      trades.map(async (trade) => {
        const legs = await Database.trades.getLegsByTradeId(trade.id);
        const tags = await Database.trades.getTradeTags(trade.id);
        return {
          id: trade.id,
          symbol: trade.symbol,
          open_date: trade.open_date,
          close_date: trade.close_date ?? undefined,
          opening_note: trade.opening_note ?? undefined,
          closing_note: trade.closing_note ?? undefined,
          legs: legs.map((leg) => {
            return {
              side: leg.side,
              quantity: parseInt(leg.quantity),
              open_price: parseFloat(leg.open_price),
              close_price: leg.close_price ? parseFloat(leg.close_price) : undefined,
              strike: leg.strike ? parseFloat(leg.strike) : undefined,
              expiration: leg.expiration ?? undefined,
              put_call: leg.put_call ?? undefined
            };
          }),
          tags: tags.map((tag) => tag.name),
          created_on: trade.created_on,
          updated_on: trade.updated_on,
          project_id: trade.project_id
        };
      })
    );

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to get trades");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get trades.");
  }
};

// GET /trades/:id
export const getTrade = async (request: Request, response: Response) => {
  try {
    const id = Number(request.params.id);

    const trade = await Database.trades.getTradeById(id);
    if (!trade) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "That trade does not exist.");
    }

    const legs = await Database.trades.getLegsByTradeId(trade.id);
    const tags = await Database.trades.getTradeTags(trade.id);

    const res: GetTradeDto = {
      id: trade.id,
      symbol: trade.symbol,
      open_date: trade.open_date,
      close_date: trade.close_date ?? undefined,
      opening_note: trade.opening_note ?? undefined,
      closing_note: trade.closing_note ?? undefined,
      legs: legs.map((leg) => {
        return {
          side: leg.side,
          quantity: parseInt(leg.quantity),
          open_price: parseFloat(leg.open_price),
          closePrice: leg.close_price ? parseFloat(leg.close_price) : undefined,
          strike: leg.strike ? parseFloat(leg.strike) : undefined,
          expiration: leg.expiration ?? undefined,
          put_call: leg.put_call ?? undefined
        };
      }),
      tags: tags.map((tag) => tag.name),
      created_on: trade.created_on,
      updated_on: trade.updated_on,
      project_id: trade.project_id
    };

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to get trade by id");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get trade.");
  }
};

// POST /projects/:username/:project
export const addTrade = async (request: Request, response: Response) => {
  try {
    const { username, project: projectName } = request.params;
    const userUUID = request.body.userUUID;

    const user = await Database.users.getUserByUsername(username);
    if (!user) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not exist.");
    }

    if (userUUID !== user.uuid) {
      return sendError(request, response, StatusCodes.FORBIDDEN, "Forbidden.");
    }

    const project = await Database.projects.getProjectByName(user.uuid, projectName);
    if (!project) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "User does not have a project with that name.");
    }

    const { symbol, open_date, opening_note, legs, tags } = request.body;

    if (!(symbol && open_date && legs && legs.length > 0 && legs[0].side && legs[0].quantity && legs[0].open_price >= 0)) {
      return sendError(request, response, StatusCodes.BAD_REQUEST, "A trade was not provided.");
    }

    const model: CreateTradeModel = {
      symbol: symbol.toUpperCase(),
      open_date,
      opening_note: opening_note ?? undefined,
      legs,
      tags
    };

    await Database.trades.addTrade(project.id, model);

    response.sendStatus(StatusCodes.CREATED);
  }
  catch (error) {
    logError(error, "Failed to add trade");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to add trade.");
  }
};

// PATCH /trades/:id
export const updateTradeById = async (request: Request, response: Response) => {
  try {
    const id = Number(request.params.id);

    const trade = await Database.trades.getTradeById(id);
    if (!trade) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "That trade does not exist.");
    }

    const project = await Database.projects.getProjectById(trade.project_id);
    const user = await Database.users.getUserByUUID(project.user_uuid);

    const { userUUID, ...updateData } = request.body;

    if (userUUID !== user.uuid) {
      return sendError(request, response, StatusCodes.FORBIDDEN, "Forbidden.");
    }

    const model: TradeUpdateModel = {
      symbol: updateData.symbol ?? undefined,
      open_date: updateData.open_date ? new Date(updateData.open_date) : undefined,
      close_date: updateData.close_date ? new Date(updateData.close_date) : undefined,
      opening_note: updateData.opening_note ?? undefined,
      closing_note: updateData.closing_note ?? undefined,
      legs: updateData.legs ?? undefined,
      tags: updateData.tags ?? undefined
    };

    await Database.trades.updateTrade(trade.id, model);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    logError(error, "Failed to update project");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update project.");
  }
};

// DELETE /trades/:id
export const deleteTradeById = async (request: Request, response: Response) => {
  try {
    const id = Number(request.params.id);

    const trade = await Database.trades.getTradeById(id);
    if (trade) {
      const project = await Database.projects.getProjectById(trade.project_id);
      const user = await Database.users.getUserByUUID(project.user_uuid);

      const userUUID = request.body.userUUID;

      if (userUUID !== user.uuid) {
        return sendError(request, response, StatusCodes.FORBIDDEN, "Forbidden.");
      }

      await Database.trades.deleteTradeById(trade.id);
    }

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    logError(error, "Failed to delete trade");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete trade.");
  }
};