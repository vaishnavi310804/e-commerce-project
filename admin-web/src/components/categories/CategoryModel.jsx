import { useEffect, useState } from "react";
import { createCategory, updateCategory } from "../../services/categoryApi";
import {
  FaTimes,
  FaTshirt,
  FaMobileAlt,
  FaClock,
  FaLaptop,
  FaHeadphones,
  FaShoppingBag,
  FaShoePrints,
  FaHome,
  FaBook,
  FaGamepad,
} from "react-icons/fa";
import { GiSonicShoes, GiLipstick } from "react-icons/gi";
import { TbHorseToy } from "react-icons/tb";

const CategoryModel = ({ open, onClose, category, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "grid-outline",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        icon: category.icon || "grid-outline",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        icon: "grid-outline",
      });
    }
  }, [category, open]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      icon: "grid-outline",
    });

    onClose();
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const categoryNameRegex = /^[a-zA-Z0-9\s\-&'.,()/]+$/;
  const categoryName = formData.name.trim();

  if (!categoryName) {
    alert("Category name is required.");
    return;
  }

  if (categoryName.length < 2 || categoryName.length > 50) {
    alert("Category name must be between 2 and 50 characters.");
    return;
  }

  if (!categoryNameRegex.test(categoryName)) {
    alert(
      "Invalid category name."
    );
    return;
  }

  if (!formData.description.trim()) {
    alert("Description is required.");
    return;
  }

  try {
    setSubmitting(true);

    if (category) {
      await updateCategory(category._id, formData);
    } else {
      await createCategory(formData);
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
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-semibold">
            {category ? "Edit Category" : "Add Category"}
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Category Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Category Icon
              </label>

              <div className="grid grid-cols-5 gap-3 sm:grid-cols-5">
                {[
                  { name: "shirt", icon: FaTshirt, label: "Clothes" },
                  { name: "mobile", icon: FaMobileAlt, label: "Electronics" },
                  { name: "watch", icon: FaClock, label: "Watches" },
                  { name: "laptop", icon: FaLaptop, label: "Laptop" },
                  { name: "audio", icon: FaHeadphones, label: "Audio" },
                  { name: "bag", icon: FaShoppingBag, label: "Bags" },
                  { name: "shoes", icon: GiSonicShoes, label: "Shoes" },
                  { name: "home", icon: FaHome, label: "Home" },
                  { name: "books", icon: FaBook, label: "Books" },
                  { name: "gaming", icon: FaGamepad, label: "Gaming" },
                  { name: "beauty", icon: GiLipstick, label: "Beauty" },
                  { name: "toy", icon: TbHorseToy, label: "Toy" },
                ].map((icon) => (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        icon: icon.name,
                      }))
                    }
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 transition ${
                      formData.icon === icon.name
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <icon.icon className="text-2xl" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-5 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : category
                  ? "Update Category"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModel;
