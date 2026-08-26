import {
  createProductService,
  getAllProductsService,
  getAllProductsAdminService,
  getProductByIdService,
  productStatusService,
  bulkUpdateProductVisibilityService,
  updateProductService,
  getProductsByCategoryService
} from "./product.service.js";

export const createProduct = async (req, res, next) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const product = await createProductService(req.body, req.file);
    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await getAllProductsService();
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await getAllProductsAdminService();
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const products = await getProductsByCategoryService(categoryId);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await getProductByIdService(req.params.id);
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const productStatus = async (req, res, next) => {
  try {
    const product = await productStatusService(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Product status updated successfully.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await updateProductService(
      req.params.id,
      req.body,
      req.file
    );
    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const bulkUpdateProductVisibility = async (req, res, next) => {
  try {
    const { productIds, isActive } = req.body;
    const result = await bulkUpdateProductVisibilityService(productIds, isActive);
    return res.status(200).json({
      success: true,
      message: "Bulk product visibility updated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
