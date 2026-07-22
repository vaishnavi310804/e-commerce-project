import React from "react";
import { FaEdit } from "react-icons/fa";

const CategoryTable = ({ categories, loading, onEdit, onToggleStatus }) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">
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
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Description</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Created</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr
              key={category._id}
              className="border-t transition hover:bg-gray-50"
            >
              <td className="px-6 py-4 font-medium">{category.name}</td>

              <td className="px-6 py-4">{category.description}</td>

              <td className="px-6 py-4">
                <button
                  onClick={() => onToggleStatus(category)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${
                    category.isActive ? "bg-green-500" : "bg-red-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                      category.isActive ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
              </td>

              <td className="px-6 py-4">
                {new Date(category.createdAt).toLocaleDateString()}
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(category)}
                    className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                    title="Edit Category"
                  >
                    <FaEdit size={18} />
                  </button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
