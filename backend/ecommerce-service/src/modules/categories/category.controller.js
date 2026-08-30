import {
  createCategoryService,
  getAllCategoriesService,
  getAllCategoriesAdminService,
  getCategoryByIdService,
  updateCategoryService,
  categoryStatusService,
  bulkUpdateCategoryVisibilityService,
} from "./category.service.js";

export const createCategory = async (req, res, next) => {
  try {
    const category = await createCategoryService(req.body);

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategoriesService();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategoriesAdmin = async (req, res, next) => {
  try {
    const categories = await getAllCategoriesAdminService();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await getCategoryByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await updateCategoryService(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};


export const categoryStatus = async (req, res, next) => {
  try {
    const category = await categoryStatusService(req.params.id);

    return res.status(200).json({
      success: true,
      message: `Category ${
        category.isActive ? "activated" : "deactivated"
      } successfully.`,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const bulkUpdateCategoryVisibility = async (req, res, next) => {
  try {
    const { categoryIds, isActive } = req.body;
    const result = await bulkUpdateCategoryVisibilityService(categoryIds, isActive);

    return res.status(200).json({
      success: true,
      message: "Bulk category visibility updated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};