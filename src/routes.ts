import { Router } from "express";
import { verifyJwtToken } from "./middleware/authentication";
import * as auth from "./endpoints/auth/auth";
import * as user from "./endpoints/user/user";
import * as users from "./endpoints/users/users";
import * as projects from "./endpoints/projects/projects";

const router = Router();

// User
router.get("/user", [verifyJwtToken], user.get);
router.patch("/user", [verifyJwtToken], user.update);
router.delete("/user", [verifyJwtToken], user.deleteUser);

// Users
router.post("/users", users.createUser);
router.get("/users/:username", users.getUser);

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

export default router;