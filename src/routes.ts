import { Express } from "express";
import * as auth from "./controllers/authController";
import * as projects from "./controllers/projectController";
import * as trades from "./controllers/tradeController";
import * as users from "./controllers/userController";
import { getMyUsername } from "./controllers/userController";
import { verifyJwtToken } from "./middleware/authentication";

export const attachRoutes = (app: Express) => {
  // Session
  app.get("/api/session/username", [verifyJwtToken], getMyUsername);
  app.get("/api/session/email", [verifyJwtToken], users.getEmail);
  app.post("/api/session/change_username", [verifyJwtToken], users.changeUsername);
  app.post("/api/session/change_password", [verifyJwtToken], users.changePassword);
  app.post("/api/session/change_email", [verifyJwtToken], users.changeEmail);
  app.post("/api/session/check_email_available", users.checkEmailAvailable);
  app.post("/api/session/check_username_available", users.checkUsernameAvailable);

  // Users
  app.post("/api/users", users.createUser);
  app.get("/api/users/:username", users.getUser);
  app.delete("/api/users/:username", [verifyJwtToken], users.deleteAccount);

  // Authentication
  app.post("/api/auth/authenticate", auth.authenticateUser);

  // Projects
  app.post("/api/projects", [verifyJwtToken], projects.createProject);
  app.get("/api/projects/:username", projects.getProjects);
  app.get("/api/projects/:username/:project", projects.getProjectByName);
  app.patch("/api/projects/:username/:project", [verifyJwtToken], projects.updateProject);
  app.delete("/api/projects/:username/:project", [verifyJwtToken], projects.deleteProject);
  app.post(
    "/api/projects/:username/:project",
    [verifyJwtToken],
    trades.addTrade
  );
  app.get("/api/projects/:username/:project/trades", trades.getTrades);

  // Trades
  app.get("/api/trades/:id", trades.getTradeById);
  app.patch("/api/trades/:id", [verifyJwtToken], trades.updateTradeById);
  app.delete("/api/trades/:id", [verifyJwtToken], trades.deleteTradeById);
};