import * as auth from "./controllers/authController";
import * as users from "./controllers/userController";
import { getApp } from "./controllers/clientController";
import { Express } from "express";
import {verifyJwtToken} from "./middleware/authentication";

export const attachRoutes = (app: Express): void => {
  app.post("/api/users", users.createUser);
  app.post("/api/users/check_email_available", users.checkEmailAvailable);
  app.post("/api/users/check_username_available", users.checkUsernameAvailable);
  app.get("/api/users/:username", users.getUser);
  app.post("/api/auth/authenticate", auth.authenticateUser);
  app.get("/api/auth/me", [verifyJwtToken], auth.getMyInfo);
  app.get("/dashboard", [verifyJwtToken], getApp);
  app.get("/*", getApp);
};