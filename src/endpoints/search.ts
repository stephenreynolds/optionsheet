import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logError, sendError } from "../error";
import Request from "../request";

export const searchTrades = async (request: Request, response: Response) => {
  try {
    const query = request.query;
    const symbol = query.symbol.toString().toUpperCase();
    const limit = Number(query.limit) ?? 20;
    const page = Number(query.page) ?? 1;

    const dataService = request.dataService;

    const symbols = await dataService.getTradesBySymbol(symbol.toString(), limit, page - 1);

    response.send(symbols);
  }
  catch (error) {
    const message = "Failed to search trades";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};