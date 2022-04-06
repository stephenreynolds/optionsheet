import Request from "../../request";
import { NextFunction, Response } from "express";
import { MockDatabase } from "./database";

const database = new MockDatabase();

const mockDataService = async (request: Request, response: Response, next: NextFunction) => {
  request.dataService = database;
  next();
};

export default mockDataService;