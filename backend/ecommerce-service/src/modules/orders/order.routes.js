import express from "express"
import { protect } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import { createOrderValidation, updateOrderStatusValidation } from "./order.validation.js";
import { createOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, getOrderDetails, updateOrderStatus } from "./order.controller.js";
import { authorize } from '../../middleware/role.middleware.js';

const router =express.Router();

router.post("/", protect, createOrderValidation, validate, createOrder)

router.get( "/getOrders", protect, getMyOrders );

router.get( "/:id", protect, getOrderById );

router.patch( "/cancel/:id", protect, cancelOrder );



//Admin Routes

router.get(
  "/admin/all", protect, authorize("ADMIN"), getAllOrders
);

router.get( "/admin/:id", protect, authorize("ADMIN"), getOrderDetails
);

router.patch( "/admin/:id/status", protect, authorize("ADMIN"), updateOrderStatusValidation, 
validate ,updateOrderStatus
);


export default router;