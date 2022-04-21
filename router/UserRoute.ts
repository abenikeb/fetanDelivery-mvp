import express from "express";
const router = express.Router();

import {
  UserSignUp,
  UserLogin,
  GetUserProfile,
  EditUserProfile,
} from "../controller";
import { Authenticate } from "../middleware/CommonAuth";

// Signup User
router.post("/signup", UserSignUp);
// Login User
router.post("/login", UserLogin);

/*
profile
*/
router.get("/profile", Authenticate, GetUserProfile);
router.patch("/edit_profile", Authenticate, EditUserProfile);

export { router as UserRoute };
