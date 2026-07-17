import express from "express"
import {addToWishlist, getWishlist, removeFromWishlist, toggleWishlist}from "./wishlist.controller.js"
import { protect } from '../../middleware/auth.middleware.js';

const router=express.Router();

router.post("/add/:productId", protect, addToWishlist);

router.get("/get", protect,getWishlist );

router.delete("/remove/:productId", protect , removeFromWishlist)

router.post("/toggle/:productId", protect, toggleWishlist)

export default router;