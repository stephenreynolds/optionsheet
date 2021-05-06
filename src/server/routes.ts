import * as auth from "./controllers/authController";
import * as users from "./controllers/userController";
import * as projects from "./controllers/projectController";
import { getApp } from "./controllers/clientController";
import { Express } from "express";
import { verifyJwtToken } from "./middleware/authentication";

export const attachRoutes = (app: Express): void => {
  app.post("/api/users", users.createUser);
  app.get("/api/users/:username", users.getUser);
  app.post("/api/auth/check_email_available", users.checkEmailAvailable);
  app.post("/api/auth/check_username_available", users.checkUsernameAvailable);
  app.post("/api/auth/authenticate", auth.authenticateUser);
  app.get("/api/auth/me", [verifyJwtToken], auth.getMyInfo);
  app.post("/api/projects", [verifyJwtToken], projects.createProject);
  app.get("/api/projects", projects.getProjects);
  app.get("/*", getApp);
};
