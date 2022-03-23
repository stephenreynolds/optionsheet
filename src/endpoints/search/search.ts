import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logError, sendError } from "../../error";
import Request from "../../request";
import { SearchDto } from "./searchDtos";

// GET /search
export const searchAll = async (request: Request, response: Response) => {
  try {
    const query = request.query;
    const term = query.q ? query.q.toString() : undefined;

    if (!term) {
      return sendError(request, response, StatusCodes.BAD_REQUEST, "Missing search terms");
    }

    const type = query.type ? query.type.toString() : undefined;
    const limit = query.limit ? Number(query.limit) : 20;
    const page = query.page ? Number(query.page) : 1;

    const dataService = request.dataService;

    let items = [];

    if (type === "trade" || !type) {
      items = await dataService.trades.getTradesBySymbol(term, limit, page - 1);
    }
    else if (type === "project") {
      const projects = await dataService.projects.getProjectsByName(term, limit, page - 1);
      items = projects.map((project) => {
        return {
          name: project.name,
          description: project.description,
          tags: project.tags,
          updated_on: new Date(project.updated_on),
          username: project.username,
          trades: project.trades
        };
      });
    }
    else if (type === "user") {
      items = await dataService.users.getUsersByUsername(term, limit, page - 1);
    }

    const res: SearchDto = {
      items,
      counts: {
        trades: await dataService.trades.getTradeMatches(term),
        projects: await dataService.projects.getProjectMatches(term),
        users: await dataService.users.getUserMatches(term)
      }
    };

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to search");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to search.");
  }
};