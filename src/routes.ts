import { Router } from "express";
import { verifyJwtToken } from "./middleware/authentication";
import * as auth from "./endpoints/auth/auth";
import * as projects from "./endpoints/projects/projects";
import * as search from "./endpoints/search/search";
import * as trades from "./endpoints/trades/trades";
import * as user from "./endpoints/user/user";
import * as users from "./endpoints/users/users";

const router = Router();

// User
router.get("/user", [verifyJwtToken], user.get);
router.patch("/user", [verifyJwtToken], user.update);
router.delete("/user", [verifyJwtToken], user.deleteAccount);
router.get("/user/starred", [verifyJwtToken], user.getStarredProjects);
router.get("/user/starred/:owner/:project", [verifyJwtToken], user.isProjectStarred);
router.put("/user/starred/:owner/:project", [verifyJwtToken], user.starProject);
router.delete("/user/starred/:owner/:project", [verifyJwtToken], user.unStarProject);

// Users
router.get("/users/:username", users.getUser);
router.post("/users", users.createUser);
router.get("/users/:username/starred", users.getStarredProjects);

// Auth
router.post("/auth", auth.authenticate);
router.post("/auth/refresh", auth.refreshToken);
router.get("/auth/check-credentials", auth.emailAndUsernameAvailable);

// Projects
router.post("/projects", [verifyJwtToken], projects.createProject);
router.get("/projects/:username", projects.getProjects);
router.get("/projects/:username/:project", projects.getProjectByName);
router.patch("/projects/:username/:project", [verifyJwtToken], projects.updateProject);
router.delete("/projects/:username/:project", [verifyJwtToken], projects.deleteProjectByName);
router.post(
  "/projects/:username/:project",
  [verifyJwtToken],
  trades.addTrade
);
router.get("/projects/:username/:project/trades", trades.getTrades);

// Trades
router.get("/trades/:id", trades.getTrade);
router.patch("/trades/:id", [verifyJwtToken], trades.updateTradeById);
router.delete("/trades/:id", [verifyJwtToken], trades.deleteTradeById);

// Search
router.get("/search", search.searchAll);

export default router;