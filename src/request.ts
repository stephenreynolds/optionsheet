import { Request as ExpressRequest } from "express";
import { Database } from "./data/database";
import multer from "multer";

export default interface Request extends ExpressRequest {
  dataService: Database;
  file?: multer.File;
}