import express from "express";
import {createCategory, getAllCategories, getCategoryById, updateCategory, categoryStatus} from "./category.controller.js";
import { createCategoryValidation, updateCategoryValidation } from "./category.validation.js";
import { protect } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import {authorize} from "../../middleware/role.middleware.js";

const router = express.Router();

router.post("/create", protect, authorize("ADMIN"), createCategoryValidation,validate ,createCategory);

router.get("/getAll", getAllCategories);

router.get("/get/:id", getCategoryById);

router.put("/update/:id",protect, authorize("ADMIN"), updateCategoryValidation, validate, updateCategory);

router.patch("/status/:id",protect, authorize("ADMIN"),  categoryStatus);


export default router;