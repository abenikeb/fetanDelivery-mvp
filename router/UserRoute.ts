import express from "express";
const router = express.Router();

import { UserController } from "../controller/UserController";

// Signup User
router.post("/signup", UserController);

export { router as UserRoute };
