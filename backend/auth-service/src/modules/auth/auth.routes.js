import express from "express";

import {
  registerUser,
  loginUser,
} from "./auth.controller.js";

import {
  registerValidation,
  loginValidation,
} from "./auth.validation.js";

import validate from "../../middleware/validate.js";

const router = express.Router();

// Register
router.post(
  "/register",
  registerValidation,
  validate,
  registerUser
);

// Login
router.post(
  "/login",
  loginValidation,
  validate,
  loginUser
);

export default router;