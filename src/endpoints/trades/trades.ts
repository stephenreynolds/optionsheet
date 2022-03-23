import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateTradeModel } from "../../data/models/trade";
import { logError, sendError } from "../../error";
import Request from "../../request";
import { GetTradeDto } from "./tradeDtos";

// GET /projects/:username/:project/trades
export const getTrades = async (request: Request, response: Response) => {
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

    const trades = await dataService.trades.getTradesByProject(project.id);

    const res: GetTradeDto[] = await Promise.all(
      trades.map(async (trade) => {
        const legs = await dataService.trades.getLegsByTradeId(trade.id);
        const tags = await dataService.trades.getTradeTags(trade.id);

        return {
          id: trade.id,
          symbol: trade.symbol,
          open_date: new Date(trade.open_date),
          close_date: trade.close_date ? new Date(trade.close_date) : undefined,
          opening_note: trade.opening_note ?? undefined,
          closing_note: trade.closing_note ?? undefined,
          legs: legs.map((leg) => {
            return {
              side: leg.side,
              quantity: Number(leg.quantity),
              open_price: Number(leg.open_price),
              closePrice: leg.close_price ? Number(leg.close_price) : undefined,
              strike: leg.strike ? Number(leg.strike) : undefined,
              expiration: leg.expiration ? new Date(leg.expiration) : undefined,
              put_call: leg.put_call ?? undefined
            };
          }),
          tags: tags.map((tag) => tag.name)
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
    const dataService = request.dataService;

    const trade = await dataService.trades.getTradeById(id);
    if (!trade) {
      return sendError(request, response, StatusCodes.NOT_FOUND, "That trade does not exist.");
    }

    const legs = await dataService.trades.getLegsByTradeId(trade.id);
    const tags = await dataService.trades.getTradeTags(trade.id);

    const res: GetTradeDto = {
      id: trade.id,
      symbol: trade.symbol,
      open_date: new Date(trade.open_date),
      close_date: trade.close_date ? new Date(trade.close_date) : undefined,
      opening_note: trade.opening_note ?? undefined,
      closing_note: trade.closing_note ?? undefined,
      legs: legs.map((leg) => {
        return {
          side: leg.side,
          quantity: Number(leg.quantity),
          open_price: Number(leg.open_price),
          closePrice: leg.close_price ? Number(leg.close_price) : undefined,
          strike: leg.strike ? Number(leg.strike) : undefined,
          expiration: leg.expiration ? new Date(leg.expiration) : undefined,
          put_call: leg.put_call ?? undefined
        };
      }),
      tags: tags.map((tag) => tag.name)
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

    const { symbol, open_date, opening_note, legs, tags } = request.body;

    if (!(symbol && open_date && legs && legs.length > 0 && legs[0].side && legs[0].quantity && legs[0].openPrice >= 0)) {
      return sendError(request, response, StatusCodes.BAD_REQUEST, "A trade was not provided.");
    }

    const model: CreateTradeModel = {
      symbol: symbol.toUpperCase(),
      open_date,
      opening_note: opening_note ?? undefined,
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