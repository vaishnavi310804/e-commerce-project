import Product from "./product.model.js";
import Category from "../categories/category.model.js";
import slugify from "../../utils/slug.js";
import mongoose from "mongoose";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinaryUpload.js";

export const createProductService = async (productData, file) => {
  const {
    name,
    description,
    price,
    brand,
    category,
    stock,
    isFeatured,
    discountPrice,
  } = productData;

  const existingCategory = await Category.findById(category);

  if (!existingCategory) {
    throw new Error("Category not found.");
  }

  const slug = slugify(name);

  const existingProduct = await Product.findOne({
    $or: [{ name }, { slug }],
  });

  if (existingProduct) {
    throw new Error("Product already exists.");
  }

  const parsedDiscountPrice =
    discountPrice !== undefined && discountPrice !== ""
      ? Number(discountPrice)
      : 0;
  const parsedPrice = Number(price);

  if (parsedDiscountPrice > 0 && parsedDiscountPrice >= parsedPrice) {
    throw new Error("Discount price must be less than the original price.");
  }

  let productImage = {
    url: "",
    public_id: "",
  };

  if (file) {
    const uploadedImage = await uploadToCloudinary(file.buffer);
    productImage = {
      url: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
    };
  }

  const product = await Product.create({
    name,
    slug,
    description,
    price: parsedPrice,
    brand,
    category,
    productImage,
    stock: Number(stock),
    isFeatured: isFeatured === "true" || isFeatured === true,
    discountPrice: parsedDiscountPrice,
  });

  return product;
};

export const getAllProductsService = async () => {
  const activeCategories = await Category.find({ isActive: true }).select("_id");
  const activeCategoryIds = activeCategories.map((c) => c._id);

  return await Product.find({
    isActive: true,
    category: { $in: activeCategoryIds },
  })
    .populate("category", "name slug")
    .sort({ createdAt: -1 });
};

export const getProductsByCategoryService = async (categoryId) => {
  const activeCategory = await Category.findOne({
    _id: categoryId,
    isActive: true,
  });

  if (!activeCategory) {
    return [];
  }

  return await Product.find({
    category: categoryId,
    isActive: true,
  })
    .populate("category", "name slug")
    .sort({ createdAt: -1 });
};

export const getAllProductsAdminService = async () => {
  return await Product.find()
    .populate("category", "name slug")
    .sort({ createdAt: -1 });
};

export const getProductByIdService = async (productId) => {
  const product = await Product.findById(productId).populate(
    "category",
    "name slug isActive",
  );

  if (
    !product ||
    !product.isActive ||
    !product.category ||
    product.category.isActive === false
  ) {
    const error = new Error("Product not found.");
    error.statusCode = 404;
    throw error;
  }
  return product;
};


export const productStatusService = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }
  product.isActive = !product.isActive;
  await product.save();
  return product;
};

export const bulkUpdateProductVisibilityService = async (productIds = [], isActive = true) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    const error = new Error("Product IDs must be a non-empty array.");
    error.statusCode = 400;
    throw error;
  }

  const validIds = [...new Set(productIds)]
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  if (!validIds.length) {
    const error = new Error("No valid product IDs provided.");
    error.statusCode = 400;
    throw error;
  }

  const result = await Product.updateMany(
    { _id: { $in: validIds } },
    { $set: { isActive: Boolean(isActive) } }
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
};

export const updateProductService = async (productId, productData, file) => {
  const updateData = { ...productData };
  const existingProduct = await Product.findById(productId);
  if (!existingProduct) {
    throw new Error("Product not found.");
  }
  if (productData.name) {
    updateData.slug = slugify(productData.name);
    const duplicateProduct = await Product.findOne({
      _id: { $ne: productId },
      $or: [{ name: updateData.name }, { slug: updateData.slug }],
    });

    if (duplicateProduct) {
      throw new Error("Product already exists.");
    }
  }

  if (productData.category) {
    const category = await Category.findById(productData.category);

    if (!category) {
      throw new Error("Category not found.");
    }
  }

  const price =
    updateData.price !== undefined && updateData.price !== ""
      ? Number(updateData.price)
      : Number(existingProduct.price);

  const discountPrice =
    updateData.discountPrice !== undefined && updateData.discountPrice !== ""
      ? Number(updateData.discountPrice)
      : Number(existingProduct.discountPrice || 0);

  if (
    updateData.discountPrice !== undefined &&
    discountPrice > 0 &&
    discountPrice >= price
  ) {
    throw new Error("Discount price must be less than the original price.");
  }

  if (updateData.price !== undefined) updateData.price = price;
  if (updateData.discountPrice !== undefined)
    updateData.discountPrice = discountPrice;
  if (updateData.stock !== undefined)
    updateData.stock = Number(updateData.stock);

  if (file) {
    // Delete previous image
    if (existingProduct.productImage?.public_id) {
      await deleteFromCloudinary(existingProduct.productImage.public_id);
    }

    const uploadedImage = await uploadToCloudinary(file.buffer);

    updateData.productImage = {
      url: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
    };
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  ).populate("category", "name slug");

  return updatedProduct;
};

export const deductProductStock = async (items) => {
  const deducted = [];

  try {
    for (const item of items) {
      const productId = item.product?._id || item.product;
      const quantity = Number(item.quantity || 0);

      if (!productId || quantity <= 0) continue;

      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: productId,
          stock: { $gte: quantity },
        },
        {
          $inc: { stock: -quantity },
        },
        { new: true }
      );

      if (!updatedProduct) {
        const p = await Product.findById(productId);
        const productName = p ? p.name : "Product";
        const availableStock = p ? p.stock : 0;
        const error = new Error(
          `Insufficient stock for "${productName}". Available: ${availableStock}, Requested: ${quantity}`
        );
        error.statusCode = 400;
        throw error;
      }

      deducted.push({ productId, quantity });
    }
  } catch (error) {
    for (const item of deducted) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: item.quantity } }
      );
    }
    throw error;
  }
};

export const restoreProductStock = async (items) => {
  for (const item of items) {
    const productId = item.product?._id || item.product;
    const quantity = Number(item.quantity || 0);

    if (productId && quantity > 0) {
      await Product.updateOne(
        { _id: productId },
        { $inc: { stock: quantity } }
      );
    }
  }
};
