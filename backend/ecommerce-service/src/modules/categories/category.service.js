import Category from "./category.model.js";
import slugify from "../../utils/slug.js";
import mongoose from "mongoose";

export const createCategoryService = async (categoryData) => {
  const {
    name,
    description,
    icon,
    isActive,
  } = categoryData;

  const slug = slugify(name);

  const existingCategory = await Category.findOne({
    $or: [{ name }, { slug }],
  });

  if (existingCategory) {
    throw new Error("Category already exists.");
  }

  const category = await Category.create({
    name,
    slug,
    description,
    icon,
    isActive,
  });

  return category;
};

export const getAllCategoriesService = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

export const getCategoryByIdService = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found.");
  }

  return category;
};

export const updateCategoryService = async (categoryId, categoryData) => {
  const updateData = { ...categoryData };

  if (categoryData.name) {
    updateData.slug = slugify(categoryData.name);

    const existingCategory = await Category.findOne({
      _id: { $ne: categoryId },
      $or: [
        { name: updateData.name },
        { slug: updateData.slug },
      ],
    });

    if (existingCategory) {
      throw new Error("Category already exists.");
    }
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    throw new Error("Category not found.");
  }

  return category;
};

export const categoryStatusService = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found.");
  }

  category.isActive = !category.isActive;

  await category.save();

  return category;
};

export const bulkUpdateCategoryVisibilityService = async (categoryIds = [], isActive = true) => {
  if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
    const error = new Error("Category IDs must be a non-empty array.");
    error.statusCode = 400;
    throw error;
  }

  const validIds = [...new Set(categoryIds)]
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  if (!validIds.length) {
    const error = new Error("No valid category IDs provided.");
    error.statusCode = 400;
    throw error;
  }

  const result = await Category.updateMany(
    { _id: { $in: validIds } },
    { $set: { isActive: Boolean(isActive) } }
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
};