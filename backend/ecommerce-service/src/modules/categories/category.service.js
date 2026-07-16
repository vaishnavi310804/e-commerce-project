import Category from "./category.model.js";
import slugify from "../../utils/slug.js";


export const createCategoryService = async (categoryData) => {
  const { name, description, isActive } = categoryData;

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