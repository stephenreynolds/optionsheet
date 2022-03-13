import { Express } from "express";
import * as auth from "./controllers/authController";
import * as projects from "./controllers/projectController";
import * as trades from "./controllers/tradeController";
import * as users from "./controllers/userController";
import { verifyJwtToken } from "./middleware/authentication";
import * as user from "./endpoints/user";

export const attachRoutes = (app: Express) => {
  // Users
  app.get("/user", [verifyJwtToken], user.get);
  app.patch("/user", [verifyJwtToken], user.update);

  // Session
  app.post("/session/check_email_available", users.checkEmailAvailable);
  app.post("/session/check_username_available", users.checkUsernameAvailable);

  // Users
  app.post("/users", users.createUser);
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