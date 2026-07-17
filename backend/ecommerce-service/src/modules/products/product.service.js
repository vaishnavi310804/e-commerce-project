import Product from "./product.model.js";
import Category from "../categories/category.model.js";
import slugify from "../../utils/slug.js";
import {uploadToCloudinary, deleteFromCloudinary} from "../../utils/cloudinaryUpload.js";

export const createProductService = async (productData, file) => {
  const {
    name,
    description,
    price,
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

  if (
    discountPrice !== undefined &&
    Number(discountPrice) >= Number(price)
  ) {
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
    price,
    category,
    productImage,
    stock,
    isFeatured,
    discountPrice,
  });

  return product;
};

export const getAllProductsService = async () => {
    return await Product.find({isActive : true}).populate("category", "name slug").sort({ createdAt: -1 });
};

export const getAllProductsAdminService = async () => {
  return await Product.find()
    .populate("category", "name slug")
    .sort({ createdAt: -1 });
};

export const getProductByIdService = async (productId) => {
    const product = await Product.findById(productId).populate("category", "name slug");

    if (!product) {
        throw new Error("Product not found.");
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
      $or: [
        { name: updateData.name },
        { slug: updateData.slug },
      ],
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
    updateData.price !== undefined
      ? Number(updateData.price)
      : Number(existingProduct.price);

  const discountPrice =
    updateData.discountPrice !== undefined
      ? Number(updateData.discountPrice)
      : Number(existingProduct.discountPrice);

  if (
    updateData.discountPrice !== undefined &&
    discountPrice >= price
  ) {
    throw new Error("Discount price must be less than the original price.");
  }
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
    }
  ).populate("category", "name slug");

  return updatedProduct;
};
