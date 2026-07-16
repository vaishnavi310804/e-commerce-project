import express from "express";
import {registerUser, loginUser, getCurrentUser, logoutUser} from "./auth.controller.js";
import {registerValidation, loginValidation} from "./auth.validation.js";
import validate from "../../middleware/validate.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register",registerValidation, validate, registerUser);

router.post("/login", loginValidation, validate, loginUser);

router.get("/me", protect, getCurrentUser);

router.post("/logout", protect, logoutUser);

export default router;