import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import { authorize } from "../../middleware/role.middleware.js";
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
  authorize("ADMIN"),
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
  authorize("ADMIN"),
  updateReturnStatusValidation,
  validate,
  updateReturnStatus,
);

router.patch(
  "/:id/refund",
  protect,
  authorize("ADMIN"),
  returnIdValidation,
  validate,
  processReturnRefund,
);

router.patch(
  "/:id/refund/status",
  protect,
  authorize("ADMIN"),
  returnIdValidation,
  validate,
  checkReturnRefundStatus,
);

router.post(
  "/:id/replacement",
  protect,
  authorize("ADMIN"),
  returnIdValidation,
  validate,
  processReturnReplacement,
);

export default router;