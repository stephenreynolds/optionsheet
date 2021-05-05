import * as auth from "./controllers/authController";
import * as users from "./controllers/userController";
import { getApp } from "./controllers/clientController";
import { Express } from "express";
import {verifyJwtToken} from "./middleware/authentication";

export const attachRoutes = (app: Express): void => {
  app.post("/api/users", users.createUser);
  app.post("/api/users/check_email", users.checkEmail);
  app.post("/api/users/check_username", users.checkUsername);
  app.post("/api/users/authenticate", auth.authenticateUser);
  app.get("/dashboard", [verifyJwtToken], getApp);
  app.get("/*", getApp);
};