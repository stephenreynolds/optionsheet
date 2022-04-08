import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logError, sendError } from "../../error";
import { SearchDto } from "./searchDtos";
import { Database } from "../../data/database";

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

    let items = [];

    if (type === "trade" || !type) {
      items = await Database.trades.getTradesBySymbol(term, page - 1, limit);
    }
    else if (type === "project") {
      const projects = await Database.projects.getProjectsByName(term, page - 1, limit);
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
      items = await Database.users.getUsersByUsername(term, page - 1, limit);
    }

    const res: SearchDto = {
      items,
      counts: {
        trades: await Database.trades.getTradeMatches(term),
        projects: await Database.projects.getProjectMatches(term),
        users: await Database.users.getUserMatches(term)
      }
    };

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to search");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to search.");
  }
};