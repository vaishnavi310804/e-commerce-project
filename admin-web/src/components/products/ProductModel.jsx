import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import {
  createProduct,
  updateProduct,
} from "../../services/productApi";
import { getAllCategories } from "../../services/categoryApi";

const ProductModel = ({ open, onClose, product, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    discount: "",
    stock: "",
    featured: false,
    trending: false,
    image: null,
    images: [],
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

  // Populate data when editing or reset when adding
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category?._id || product.category || "",
        brand: product.brand || "",
        price: product.price ?? "",
        discount: product.discount ?? "",
        stock: product.stock ?? "",
        featured: !!product.featured,
        trending: !!product.trending,
        image: null,
        images: [],
      });
      setPreview({
        image: product.image?.url || null,
        images: product.images?.map((img) => img.url) || [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        brand: "",
        price: "",
        discount: "",
        stock: "",
        featured: false,
        trending: false,
        image: null,
        images: [],
      });
      setPreview({ image: null, images: [] });
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

  const handleMultipleImages = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
    setPreview((prev) => ({
      ...prev,
      images: files.map((f) => URL.createObjectURL(f)),
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      brand: "",
      price: "",
      discount: "",
      stock: "",
      featured: false,
      trending: false,
      image: null,
      images: [],
    });
    setPreview({ image: null, images: [] });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = () => {
    if (!formData.name.trim()) {
      alert("Product name is required.");
      return false;
    }
    if (!formData.price) {
      alert("Price is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => payload.append("images", file));
      } else if (key === "image") {
        if (value) payload.append("image", value);
      } else {
        payload.append(key, value);
      }
    });

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
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
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
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="0"
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

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Gallery Images
              </label>
              {preview.images.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {preview.images.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Gallery preview ${idx}`}
                      className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                    />
                  ))}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleImages}
                className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t bg-white px-6 py-4">
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
