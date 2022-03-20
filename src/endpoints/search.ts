import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logError, sendError } from "../error";
import Request from "../request";

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
      items = await dataService.getTradesBySymbol(term, limit, page - 1);
    }
    else if (type === "project") {
      const projects = await dataService.getProjectsByName(term, limit, page - 1);
      items = projects.map((project) => {
        return {
          name: project.name,
          description: project.description,
          tags: project.tags,
          lastEdited: new Date(project.lastEdited),
          username: project.user.username,
          trades: project.trades
        };
      });
    }
    else if (type === "user") {
      items = await dataService.getUsersByUsername(term, limit, page - 1);
    }

    const counts = {
      trades: await dataService.getTradeMatches(term),
      projects: await dataService.getProjectMatches(term),
      users: await dataService.getUserMatches(term)
    };

    response.send({
      items,
      counts
    });
  }
  catch (error) {
    const message = "Failed to search";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};