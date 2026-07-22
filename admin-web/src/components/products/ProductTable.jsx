import React from "react";
import { FaEdit } from "react-icons/fa";

const ProductTable = ({
  products,
  loading,
  onEdit,
  onToggleStatus,
}) => {

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">
        Loading products...
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        No products found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-left">Image</th>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Category</th>
            <th className="px-6 py-4 text-left">Brand</th>
            <th className="px-6 py-4 text-left">Price</th>
            <th className="px-6 py-4 text-left">Discount</th>
            <th className="px-6 py-4 text-left">Final Price</th>
            <th className="px-6 py-4 text-left">Stock</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Created</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              className="border-t transition hover:bg-gray-50"
            >
              <td className="px-6 py-4">
                {product.image?.url ? (
                  <img
                    src={product.image.url}
                    alt={product.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-500">—</span>
                )}
              </td>

              <td className="px-6 py-4 font-medium">{product.name}</td>

              <td className="px-6 py-4">{product.category?.name || "—"}</td>

              <td className="px-6 py-4">{product.brand || "—"}</td>

              <td className="px-6 py-4">{product.price?.toFixed(2)}</td>

              <td className="px-6 py-4">
                {product.discount ? `${product.discount}%` : "0%"}
              </td>

              <td className="px-6 py-4">
                {(
                  product.price *
                  (1 - (product.discount || 0) / 100)
                ).toFixed(2)}
              </td>

              <td className="px-6 py-4">{product.stock ?? "—"}</td>

              <td className="px-6 py-4">
                <button
                  onClick={() => onToggleStatus(product)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${
                    product.isActive
                      ? "bg-green-500"
                      : "bg-red-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                      product.isActive ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="ml-2 text-sm font-medium">
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="px-6 py-4">
                {new Date(product.createdAt).toLocaleDateString()}
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                    title="Edit Product"
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

export default ProductTable;