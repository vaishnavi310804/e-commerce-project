import express from "express";
import { protect } from '../../middleware/auth.middleware.js';
import { addressValidation, updateAddressValidation } from './address.validation.js';
import { addAddress, getAllAddress, getAddressById, updateAddress, deleteAddress } from './address.controller.js';
import validate from '../../middleware/validate.js';

const router =express.Router();

router.post("/", protect, addressValidation, validate, addAddress)

router.get("/get", protect, getAllAddress);

router.get( "/:id", protect, getAddressById );

router.patch("/:id", protect, updateAddressValidation, validate, updateAddress );

router.delete( "/:id", protect, deleteAddress );

export default router;
