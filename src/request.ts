import { Request as ExpressRequest } from "express";
import { Database } from "./data/database";

export default interface Request extends ExpressRequest {
  dataService: Database;
}