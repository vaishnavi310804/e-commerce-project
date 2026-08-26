import React, { useEffect, useRef } from "react";
import {
  FaEdit,
  FaTshirt,
  FaMobileAlt,
  FaClock,
  FaLaptop,
  FaHeadphones,
  FaShoppingBag,
  FaHome,
  FaBook,
  FaGamepad,
} from "react-icons/fa";
import { GiSonicShoes, GiLipstick } from "react-icons/gi";
import { TbHorseToy } from "react-icons/tb";

const categoryIcons = {
  shirt: FaTshirt,
  mobile: FaMobileAlt,
  watch: FaClock,
  laptop: FaLaptop,
  audio: FaHeadphones,
  bag: FaShoppingBag,
  shoes: GiSonicShoes,
  home: FaHome,
  books: FaBook,
  gaming: FaGamepad,
  beauty: GiLipstick,
  toy: TbHorseToy,
};

const CategoryTable = ({
  categories = [],
  loading,
  onEdit,
  onToggleStatus,
  selectedIds = [],
  onSelectAll,
  onSelectRow,
}) => {
  const headerCheckboxRef = useRef(null);

  const displayedCount = categories.length;
  const selectedDisplayedCount = categories.filter((c) =>
    selectedIds.includes(c._id)
  ).length;
  const isAllSelected =
    displayedCount > 0 && selectedDisplayedCount === displayedCount;
  const isIndeterminate =
    selectedDisplayedCount > 0 && selectedDisplayedCount < displayedCount;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center shadow">
        Loading categories...
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        No categories found.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-[#E0E0E0]">
              <tr>
                <th className="px-4 py-4 text-center w-12">
                  <input
                    type="checkbox"
                    ref={headerCheckboxRef}
                    checked={isAllSelected}
                    onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#6547C9] focus:ring-[#6547C9]"
                    title="Select All Displayed Categories"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Icon</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Created</th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => {
                const isSelected = selectedIds.includes(category._id);

                return (
                  <tr
                    key={category._id}
                    className={`border-b border-gray-300 transition hover:bg-gray-50 ${
                      isSelected ? "bg-purple-50/50" : ""
                    }`}
                  >
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRow && onSelectRow(category._id)}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#6547C9] focus:ring-[#6547C9]"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <CategoryIcon icon={category.icon} />
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {category.name}
                    </td>

                    <td className="max-w-xs px-6 py-4">
                      <p className="truncate">
                        {category.description || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <StatusToggle
                        category={category}
                        onToggleStatus={onToggleStatus}
                      />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <EditButton
                          category={category}
                          onEdit={onEdit}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {categories.map((category) => {
          const isSelected = selectedIds.includes(category._id);

          return (
            <div
              key={category._id}
              className={`rounded-xl bg-white p-4 shadow ${
                isSelected ? "ring-2 ring-[#6547C9]" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectRow && onSelectRow(category._id)}
                    className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 text-[#6547C9] focus:ring-[#6547C9]"
                  />
                  <CategoryIcon icon={category.icon} />

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {category.description || "No description"}
                    </p>
                  </div>
                </div>

                <EditButton
                  category={category}
                  onEdit={onEdit}
                />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <div>
                  <p className="text-xs text-gray-400">
                    Created
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">
                    {category.isActive ? "Active" : "Inactive"}
                  </span>

                  <StatusToggle
                    category={category}
                    onToggleStatus={onToggleStatus}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const CategoryIcon = ({ icon }) => {
  const Icon = categoryIcons[icon];

  if (!Icon) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
        ?
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#cdcad7] text-[#6547C9]">
      <Icon size={20} />
    </div>
  );
};

const StatusToggle = ({ category, onToggleStatus }) => {
  return (
    <button
      type="button"
      onClick={() => onToggleStatus(category)}
      aria-label={
        category.isActive
          ? "Disable category"
          : "Enable category"
      }
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
        category.isActive
          ? "bg-green-500"
          : "bg-red-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          category.isActive
            ? "translate-x-5"
            : "translate-x-1"
        }`}
      />
    </button>
  );
};

const EditButton = ({ category, onEdit }) => {
  return (
    <button
      type="button"
      onClick={() => onEdit(category)}
      className="shrink-0 rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
      title="Edit Category"
    >
      <FaEdit size={17} />
    </button>
  );
};

export default CategoryTable;