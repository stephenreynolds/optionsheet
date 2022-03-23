import { Router } from "express";
import * as users from "./endpoints/users/users";

const router = Router();

// Users
router.post("/users", users.createUser);
router.get("/users/:username", users.getUser);

export default router;