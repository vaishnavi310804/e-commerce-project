import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createProduct, updateProduct } from "../../services/productApi";
import { getAllCategories } from "../../services/categoryApi";

const ProductModel = ({ open, onClose, product, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    discountPrice: "",
    stock: "",
    featured: false,
    trending: false,
    image: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState({
    image: null,
    images: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error("Failed to fetch categories for product modal:", error);
      }
    };
    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category?._id || product.category || "",
        brand: product.brand || "",
        price: product.price ?? "",
        discountPrice: product.discountPrice ?? "",
        stock: product.stock ?? "",
        featured: !!(product.isFeatured ?? product.featured),
        trending: !!product.trending,
        image: null,
      });
      setPreview({
        image: product.productImage?.url || product.image?.url || null,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        brand: "",
        price: "",
        discountPrice: "",
        stock: "",
        featured: false,
        trending: false,
        image: null,
      });
      setPreview({ image: null });
    }
  }, [product, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      brand: "",
      price: "",
      discountPrice: "",
      stock: "",
      featured: false,
      trending: false,
      image: null,
    });
    setPreview({ image: null });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = () => {
    const productNameRegex = /^[a-zA-Z0-9\s\-&'.,()/]+$/;
    const productName = formData.name.trim();

    if (!productName) {
      alert("Product name is required.");
      return false;
    }

    if (!productNameRegex.test(productName)) {
      alert(
        "Invalid product name"
      );
      return false;
    }

    if (!formData.price) {
      alert("Price is required.");
      return false;
    }
    if (
      formData.discountPrice !== "" &&
      Number(formData.discountPrice) >= Number(formData.price)
    ) {
      alert("Discount price must be less than original price.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("description", formData.description.trim());
    payload.append("category", formData.category);
    payload.append("price", String(formData.price));
    payload.append("stock", String(formData.stock));
    payload.append("isFeatured", formData.featured ? "true" : "false");

    if (formData.brand && formData.brand.trim() !== "") {
      payload.append("brand", formData.brand.trim());
    }

    if (
      formData.discountPrice !== "" &&
      formData.discountPrice !== null &&
      formData.discountPrice !== undefined
    ) {
      payload.append("discountPrice", String(formData.discountPrice));
    }

    if (formData.image instanceof File) {
      payload.append("productImage", formData.image);
    }

    try {
      setSubmitting(true);
      if (product) {
        await updateProduct(product._id, payload);
      } else {
        await createProduct(payload);
      }
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Product submit error:", error);
      const backendErrors = error.response?.data?.errors;
      const backendMsg = error.response?.data?.message;

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        const errorText = backendErrors.map((err) => err.msg).join("\n");
        alert(`Validation Error:\n${errorText}`);
      } else if (backendMsg) {
        alert(backendMsg);
      } else {
        alert(error.message || "Failed to save product.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Discount Price
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>

            <div className="flex items-center gap-8 py-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Featured
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="trending"
                  checked={formData.trending}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Trending
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Primary Image
              </label>
              {preview.image && (
                <img
                  src={preview.image}
                  alt="Primary preview"
                  className="mb-3 h-24 w-24 rounded-lg border border-gray-200 object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 bg-white px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? product
                  ? "Updating..."
                  : "Creating..."
                : product
                ? "Update Product"
                : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModel;
