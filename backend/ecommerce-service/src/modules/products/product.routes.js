import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, productStatus, getAllProductsAdmin} from './product.controller.js';
import { authorize } from '../../middleware/role.middleware.js';
import { protect } from '../../middleware/auth.middleware.js';
import { createProductValidation, updateProductValidation } from './product.validation.js';
import validate from '../../middleware/validate.js';
import upload from '../../middleware/upload.middleware.js';

const router = express.Router();

router.post('/create',protect, authorize("ADMIN"), upload.single("productImage"), createProductValidation , validate, createProduct);

router.get('/getAll', getAllProducts);

router.get(
  "/admin/getAll", protect, authorize("ADMIN"),
  getAllProductsAdmin
);

router.get('/get/:id', getProductById);

router.put('/update/:id',protect, authorize("ADMIN"), upload.single("productImage"),  updateProductValidation, validate, updateProduct);

router.patch('/status/:id',protect, authorize("ADMIN"), productStatus);

export default router;