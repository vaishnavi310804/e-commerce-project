import { useEffect, useState } from "react";
import { FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import SearchBar from "../../components/common/SearchBar";
import CategoryTable from "../../components/categories/CategoryTable";
import CategoryModel from "../../components/categories/CategoryModel";

import {
  getAllCategories,
  updateCategoryStatus,
  bulkUpdateCategoryVisibility,
} from "../../services/categoryApi";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [statusFilter, setStatusFilter] = useState("active");
  const [selectedIds, setSelectedIds] = useState([]);
  const [loadingBulk, setLoadingBulk] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await getAllCategories();

      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedIds([]);
  }, [searchTerm, statusFilter]);

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
        `Category ${category.isActive ? "disabled" : "enabled"} successfully.`
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Failed to update category status."
      );
    }
  };

  const handleSelectRow = (categoryId) => {
    setSelectedIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = (shouldSelect) => {
    if (shouldSelect) {
      const displayedIds = filteredCategories.map((c) => c._id);
      setSelectedIds((prev) => [...new Set([...prev, ...displayedIds])]);
    } else {
      const displayedSet = new Set(filteredCategories.map((c) => c._id));
      setSelectedIds((prev) => prev.filter((id) => !displayedSet.has(id)));
    }
  };

  const handleBulkVisibility = async (shouldBeActive) => {
    if (!selectedIds.length || loadingBulk) return;

    const actionText = shouldBeActive ? "visible" : "hidden";
    const count = selectedIds.length;

    try {
      setLoadingBulk(true);
      await bulkUpdateCategoryVisibility(selectedIds, shouldBeActive);
      await fetchCategories();
      setSelectedIds([]);
      alert(
        `${count} categor${count > 1 ? "ies are" : "y is"} now ${actionText}.`
      );
    } catch (error) {
      console.error("Bulk Category Visibility Error:", error);
      alert(
        error.response?.data?.message || "Failed to update category visibility."
      );
    } finally {
      setLoadingBulk(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Category Dashboard
            </h1>
            <p className="mt-1 text-gray-500">Manage all product categories</p>
          </div>

          <button
            onClick={handleAddCategory}
            className="flex items-center gap-2 rounded-xl bg-[#6547C9] px-5 py-3 text-white transition hover:bg-indigo-700"
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
                ? "bg-[#6547C9] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active ({activeCount})
          </button>

          <button
            onClick={() => setStatusFilter("inactive")}
            className={`rounded-lg px-5 py-2 font-medium transition ${
              statusFilter === "inactive"
                ? "bg-[#6547C9] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Inactive ({inactiveCount})
          </button>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6547C9] text-xs font-bold text-white">
                {selectedIds.length}
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {selectedIds.length} categor{selectedIds.length > 1 ? "ies" : "y"}{" "}
                selected
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={loadingBulk}
                onClick={() => handleBulkVisibility(true)}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <FaEye /> Show Selected
              </button>

              <button
                type="button"
                disabled={loadingBulk}
                onClick={() => handleBulkVisibility(false)}
                className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50"
              >
                <FaEyeSlash /> Hide Selected
              </button>

              <button
                type="button"
                disabled={loadingBulk}
                onClick={() => setSelectedIds([])}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-purple-100 hover:text-gray-900"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        <CategoryTable
          categories={filteredCategories}
          loading={loading}
          onEdit={handleEditCategory}
          onToggleStatus={handleToggleStatus}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
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
