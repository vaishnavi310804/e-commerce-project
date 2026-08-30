import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import { authorizePermission } from "../../middleware/permission.middleware.js";
import {
  createReturn,
  getAllReturns,
  getMyReturns,
  getReturnDetails,
  updateReturnStatus,
  processReturnRefund,
  checkReturnRefundStatus,
  processReturnReplacement,
} from "./return.controller.js";
import {
  createReturnValidation,
  updateReturnStatusValidation,
  returnIdValidation,
} from "./return.validation.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createReturnValidation,
  validate,
  createReturn,
);

router.get(
  "/my",
  protect,
  getMyReturns,
);

router.get(
  "/",
  protect,
  authorizePermission("RETURNS", "VIEW"),
  getAllReturns,
);

router.get(
  "/:id",
  protect,
  returnIdValidation,
  validate,
  getReturnDetails,
);

router.patch(
  "/:id/status",
  protect,
  authorizePermission("RETURNS", "EDIT"),
  updateReturnStatusValidation,
  validate,
  updateReturnStatus,
);

router.patch(
  "/:id/refund",
  protect,
  authorizePermission("RETURNS", "EDIT"),
  returnIdValidation,
  validate,
  processReturnRefund,
);

router.patch(
  "/:id/refund/status",
  protect,
  authorizePermission("RETURNS", "EDIT"),
  returnIdValidation,
  validate,
  checkReturnRefundStatus,
);

router.post(
  "/:id/replacement",
  protect,
  authorizePermission("RETURNS", "EDIT"),
  returnIdValidation,
  validate,
  processReturnReplacement,
);

export default router;