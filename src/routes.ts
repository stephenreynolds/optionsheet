import { Router } from "express";
import * as auth from "./endpoints/auth/auth";
import * as user from "./endpoints/user/user";
import * as users from "./endpoints/users/users";
import { verifyJwtToken } from "./middleware/authentication";

const router = Router();

// User
router.get("/user", [verifyJwtToken], user.get);

// Users
router.post("/users", users.createUser);
router.get("/users/:username", users.getUser);

// Auth
router.post("/auth", auth.authenticate);
router.post("/auth/refresh", auth.refreshToken);

export default router;