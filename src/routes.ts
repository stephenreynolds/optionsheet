import { Express } from "express";
import * as auth from "./controllers/authController";
import * as projects from "./controllers/projectController";
import * as trades from "./controllers/tradeController";
import * as users from "./controllers/userController";
import { getMyUsername } from "./controllers/userController";
import { verifyJwtToken } from "./middleware/authentication";

export const attachRoutes = (app: Express) => {
  // Session
  app.get("/session/username", [verifyJwtToken], getMyUsername);
  app.get("/session/email", [verifyJwtToken], users.getEmail);
  app.post("/session/change_username", [verifyJwtToken], users.changeUsername);
  app.post("/session/change_password", [verifyJwtToken], users.changePassword);
  app.post("/session/change_email", [verifyJwtToken], users.changeEmail);
  app.post("/session/check_email_available", users.checkEmailAvailable);
  app.post("/session/check_username_available", users.checkUsernameAvailable);

  // Users
  app.post("/users", users.createUser);
  app.get("/users/:username", users.getUser);
  app.delete("/users/:username", [verifyJwtToken], users.deleteAccount);

  // Authentication
  app.post("/auth/authenticate", auth.authenticateUser);

  // Projects
  app.post("/projects", [verifyJwtToken], projects.createProject);
  app.get("/projects/:username", projects.getProjects);
  app.get("/projects/:username/:project", projects.getProjectByName);
  app.patch("/projects/:username/:project", [verifyJwtToken], projects.updateProject);
  app.delete("/projects/:username/:project", [verifyJwtToken], projects.deleteProject);
  app.post(
    "/projects/:username/:project",
    [verifyJwtToken],
    trades.addTrade
  );
  app.get("/projects/:username/:project/trades", trades.getTrades);

  // Trades
  app.get("/trades/:id", trades.getTradeById);
  app.patch("/trades/:id", [verifyJwtToken], trades.updateTradeById);
  app.delete("/trades/:id", [verifyJwtToken], trades.deleteTradeById);
};