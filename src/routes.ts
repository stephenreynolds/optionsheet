import { Router } from "express";
import { verifyJwtToken } from "./middleware/authentication";
import * as auth from "./endpoints/auth/auth";
import * as user from "./endpoints/user/user";
import * as users from "./endpoints/users/users";
import * as projects from "./endpoints/projects/projects";
import * as trades from "./endpoints/trades/trades";

const router = Router();

// User
router.get("/user", [verifyJwtToken], user.get);
router.patch("/user", [verifyJwtToken], user.update);
router.delete("/user", [verifyJwtToken], user.deleteUser);
router.get("/user/starred", [verifyJwtToken], user.getStarredProjects);
router.get("/user/starred/:owner/:project", [verifyJwtToken], user.isProjectStarred);
router.put("/user/starred/:owner/:project", [verifyJwtToken], user.starProject);
router.delete("/user/starred/:owner/:project", [verifyJwtToken], user.unStarProject);

// Users
router.post("/users", users.createUser);
router.get("/users/:username", users.getUser);
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
router.delete("/projects/:username/:project", [verifyJwtToken], projects.deleteProject);
router.post("/projects/:username/:project", [verifyJwtToken], trades.addTrade
);

export default router;