import express from "express"
import { protect } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import { createOrderValidation } from "./order.validation.js";
import { createOrder, getMyOrders, getOrderById, cancelOrder } from "./order.controller.js";

const router =express.Router();

router.post("/", protect, createOrderValidation, validate, createOrder)

router.get( "/getOrders", protect, getMyOrders );

router.get( "/:id", protect, getOrderById );

router.patch( "/cancel/:id", protect, cancelOrder );

export default router;