import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import { authorizePermission } from "../../middleware/permission.middleware.js";
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
  authorizePermission("SHIPMENTS", "CREATE"),
  createShipmentValidation,
  validate,
  createShipment,
);
router.get(
  "/",
  protect,
  authorizePermission("SHIPMENTS", "VIEW"),
  getAllShipments
);

router.get("/order/:orderId",
  protect,
  getShipmentByOrder
);

router.get(
  "/:id",
  protect,
  authorizePermission("SHIPMENTS", "VIEW"),
  shipmentIdValidation,
  validate,
  getShipmentDetails
);
router.patch(
  "/:id/status",
  protect,
  authorizePermission("SHIPMENTS", "EDIT"),
  updateShipmentStatusValidation,
  validate,
  updateShipmentStatus
);

export default router;
