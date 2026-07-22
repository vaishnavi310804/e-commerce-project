import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import SearchBar from "../../components/common/SearchBar";
import CategoryTable from "../../components/categories/CategoryTable";
import CategoryModel from "../../components/categories/CategoryModel";
import DeleteConfirmation from "../../components/categories/DeleteConfirmation";

import {
  getAllCategories,
  updateCategoryStatus,
} from "../../services/categoryApi";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [statusFilter, setStatusFilter] = useState("active");

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await getAllCategories();

      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "active" ? category.isActive : !category.isActive;

    return matchesSearch && matchesStatus;
  });

  const activeCount = categories.filter(
  (category) => category.isActive
).length;

const inactiveCount = categories.filter(
  (category) => !category.isActive
).length;
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsOpen(true);
  };
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedCategory(null);
  };

  const handleToggleStatus = async (category) => {
    try {
      await updateCategoryStatus(category._id);

      await fetchCategories();

      alert(
        `Category ${category.isActive ? "disabled" : "enabled"} successfully.`,
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Failed to update category status.",
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Categories</h1>

            <p className="mt-1 text-gray-500">Manage all product categories</p>
          </div>

          <button
            onClick={handleAddCategory}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700"
          >
            <FaPlus />
            Add Category
          </button>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search categories..."
        />

        <div className="flex gap-3">
          <button
            onClick={() => setStatusFilter("active")}
            className={`rounded-lg px-5 py-2 font-medium transition ${
              statusFilter === "active"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active ({activeCount})
          </button>

          <button
            onClick={() => setStatusFilter("inactive")}
            className={`rounded-lg px-5 py-2 font-medium transition ${
              statusFilter === "inactive"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Inactive ({inactiveCount})
          </button>
        </div>

        <CategoryTable
          categories={filteredCategories}
          loading={loading}
          onEdit={handleEditCategory}
          onToggleStatus={handleToggleStatus}
        />

        <CategoryModel
          open={isOpen}
          onClose={handleCloseModal}
          category={selectedCategory}
          onSuccess={fetchCategories}
        />
      </div>
    </DashboardLayout>
  );
};

export default Categories;
