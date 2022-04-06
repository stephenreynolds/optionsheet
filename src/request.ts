import { Request as ExpressRequest } from "express";
import multer from "multer";
import { IDatabase } from "./data/interfaces";

export default interface Request extends ExpressRequest {
  dataService: IDatabase;
  file?: multer.File;
}