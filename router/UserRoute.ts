import express from "express";
const router = express.Router();

import { UserSignUp } from "../controller";

// Signup User
router.post("/signup", UserSignUp);

export { router as UserRoute };
