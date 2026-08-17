import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import { authorize } from "../../middleware/role.middleware.js";
import {
  createShipment,
  getAllShipments,
  getShipmentDetails,
  updateShipmentStatus,
  getShipmentByOrder
} from "./shipment.controller.js";
import {
  createShipmentValidation,
  updateShipmentStatusValidation,
  shipmentIdValidation,
} from "./shipment.validation.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  createShipmentValidation,
  validate,
  createShipment,
);
router.get(
  "/",
  protect,
  authorize("ADMIN"),
  getAllShipments
);

router.get("/order/:orderId",
  protect,
  getShipmentByOrder
);

router.get(
  "/:id",
  protect,
  authorize("ADMIN"),
  shipmentIdValidation,
  validate,
  getShipmentDetails
);
router.patch(
  "/:id/status",
  protect,
  authorize("ADMIN"),
  updateShipmentStatusValidation,
  validate,
  updateShipmentStatus
);

export default router;
