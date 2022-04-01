import { Router } from "express";
import { verifyJwtToken } from "./middleware/authentication";
import { uploadImage } from "./middleware/fileUpload";
import * as auth from "./endpoints/auth/auth";
import * as user from "./endpoints/user/user";
import * as users from "./endpoints/users/users";
import * as projects from "./endpoints/projects/projects";
import * as search from "./endpoints/search/search";
import * as trades from "./endpoints/trades/trades";

const router = Router();

// User
router.get("/user", [verifyJwtToken], user.get);
router.patch("/user", [verifyJwtToken], user.update);
router.delete("/user", [verifyJwtToken], user.deleteUser);
router.post("/user/avatar", [verifyJwtToken, uploadImage.single("file"), verifyJwtToken], user.setAvatar);
router.get("/user/starred", [verifyJwtToken], user.getStarredProjects);
router.get("/user/starred/:owner/:project", [verifyJwtToken], user.isProjectStarred);
router.put("/user/starred/:owner/:project", [verifyJwtToken], user.starProject);
router.delete("/user/starred/:owner/:project", [verifyJwtToken], user.unStarProject);
router.put("/user/pinned", [verifyJwtToken], user.setPinnedProjects);
router.get("/user/settings", [verifyJwtToken], user.getDefaultProjectSettings);
router.patch("/user/settings", [verifyJwtToken], user.updateDefaultProjectSettings);

// Users
router.post("/users", users.createUser);
router.get("/users/:username", users.getUser);
router.get("/users/:username/starred", users.getStarredProjects);
router.get("/users/:username/pinned", users.getPinnedProjects);

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
router.post("/projects/:username/:project", [verifyJwtToken], trades.addTrade);
router.get("/projects/:username/:project/trades", trades.getTrades);

// Trades
router.get("/trades/:id", trades.getTrade);
router.patch("/trades/:id", [verifyJwtToken], trades.updateTradeById);
router.delete("/trades/:id", [verifyJwtToken], trades.deleteTradeById);

// Search
router.get("/search", search.searchAll);

export default router;