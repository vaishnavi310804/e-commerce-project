import express from 'express'
import { protect } from '../../middleware/auth.middleware.js';
import { addToCart, getCart, updateCart, removeFromCart, clearCart } from './cart.controller.js';
import { updateCartValidation } from './cart.validation.js';
import validate from '../../middleware/validate.js';

const router = express.Router()

router.post("/add/:productId", protect, addToCart)

router.get("/", protect, getCart);

router.patch("/update/:productId", protect, updateCartValidation, validate, updateCart)

router.delete( "/remove/:productId",
protect, removeFromCart );

router.delete( "/clear",protect, clearCart );

export default router;

