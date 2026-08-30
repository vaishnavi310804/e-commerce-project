import express from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "./role.controller.js";
import { createRoleValidation, updateRoleValidation } from "./role.validation.js";
import { validate } from "../../middleware/validate.middleware.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../../../ecommerce-service/src/middleware/role.middleware.js";

const router = express.Router();

// Role management APIs restricted strictly to SUPER_ADMIN
router.use(protect, authorize("SUPER_ADMIN"));

router.get("/", getAllRoles);
router.get("/:id", getRoleById);
router.post("/", createRoleValidation, validate, createRole);
router.put("/:id", updateRoleValidation, validate, updateRole);
router.delete("/:id", deleteRole);

export default router;
