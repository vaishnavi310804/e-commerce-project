import {createProductService, getAllProductsService, getProductByIdService, productStatusService, updateProductService} from "./product.service.js";

export const createProduct = async (req, res, next) => {
    try {
        const product = await createProductService(req.body, req.file);
        return res.status(201).json({
            success: true,
            message: "Product created successfully.",
            data: product,
        });
    }
    catch (error) {
        next(error);
    };
};

export const getAllProducts = async (req, res, next) => {
    try {
        const products = await getAllProductsService();
        return res.status(200).json({
            success: true,
            data: products,
        }); 
    }
    catch (error) {
        next(error);
    };
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
    }
    catch (error) {
        next(error);
    }  
};

export const updateProduct = async (req, res, next) => {
    try {
        const product = await updateProductService(req.params.id, req.body, req.file);
        return res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            data: product,
        }); 
    }
    catch (error) {
        next(error);
    }
};

