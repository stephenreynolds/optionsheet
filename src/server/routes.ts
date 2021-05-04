import * as users from "./controllers/userController";
import { getApp } from "./controllers/clientController";
import {Express} from "express";

export const attachRoutes = (app: Express): void => {
  app.post("/api/users", users.createUser);
  app.post("/api/users/check_email", users.checkEmail);
  app.post("/api/users/check_username", users.checkUsername);
  app.post("/api/users/authenticate", users.authenticateUser);
  app.get("/*", getApp);
};