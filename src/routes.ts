import { Express } from "express";
import { verifyJwtToken } from "./middleware/authentication";
import * as auth from "./endpoints/auth";
import * as projects from "./endpoints/projects";
import * as trades from "./endpoints/trades";
import * as user from "./endpoints/user";
import * as users from "./endpoints/users";

export const attachRoutes = (app: Express) => {
  // Users
  app.get("/user", [verifyJwtToken], user.get);
  app.patch("/user", [verifyJwtToken], user.update);
  app.delete("/user", [verifyJwtToken], user.deleteAccount);

  // Users
  app.post("/users", users.createUser);

  // Auth
  app.post("/auth/authenticate", auth.authenticateUser);
  app.get("/auth/check-credentials", auth.emailAndUsernameAvailable);

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