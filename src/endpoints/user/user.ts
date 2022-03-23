import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logError, sendError } from "../../error";
import Request from "../../request";
import { getUserDetails } from "../users/users";

// GET /user
export const get = async (request: Request, response: Response) => {
  try {
    const dataService = request.dataService;
    const { userUUID } = request.body;
    const user = await dataService.users.getUserByUUID(userUUID);

    const res = await getUserDetails(user, dataService);

    response.send(res);
  }
  catch (error) {
    logError(error, "Failed to get authenticated user");
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get authenticated user.");
  }
};