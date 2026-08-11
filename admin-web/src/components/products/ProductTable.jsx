import React from "react";
import { FaEdit } from "react-icons/fa";

const ProductTable = ({ products, loading, onEdit, onToggleStatus }) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center shadow">
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
    <>
      <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
        <div className="overflow-x-auto">
          <table className="min-w-[1300px] w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left whitespace-nowrap">Image</th>
                <th className="px-6 py-4 text-left whitespace-nowrap">Name</th>
                <th className="px-6 py-4 text-left whitespace-nowrap">
                  Category
                </th>
                <th className="px-6 py-4 text-left whitespace-nowrap">Brand</th>
                <th className="px-6 py-4 text-left whitespace-nowrap">Price</th>
                <th className="px-6 py-4 text-left whitespace-nowrap">
                  Discount Price
                </th>
                <th className="px-6 py-4 text-left whitespace-nowrap">
                  Final Price
                </th>

                <th className="px-6 py-4 text-left whitespace-nowrap">Stock</th>

                <th className="px-6 py-4 text-left whitespace-nowrap">
                  Status
                </th>

                <th className="px-6 py-4 text-left whitespace-nowrap">
                  Created
                </th>
                <th className="px-6 py-4 text-center whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const hasDiscount =
                  product.discountPrice !== undefined &&
                  product.discountPrice !== null &&
                  Number(product.discountPrice) > 0;

                const finalPrice = hasDiscount
                  ? Number(product.discountPrice)
                  : Number(product.price || 0);

                return (
                  <tr
                    key={product._id}
                    className="border-t transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ProductImage product={product} />
                    </td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {product.name}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.category?.name || "—"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.brand || "—"}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{Number(product.price || 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {hasDiscount
                        ? `₹${Number(product.discountPrice).toFixed(2)}`
                        : "—"}
                    </td>

                    <td className="px-6 py-4 font-medium text-indigo-600 whitespace-nowrap">
                      ₹{finalPrice.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.stock ?? "—"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <StatusToggle
                          product={product}
                          onToggleStatus={onToggleStatus}
                        />

                        <span className="text-sm font-medium">
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <EditButton product={product} onEdit={onEdit} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {products.map((product) => {
          const hasDiscount =
            product.discountPrice !== undefined &&
            product.discountPrice !== null &&
            Number(product.discountPrice) > 0;

          const finalPrice = hasDiscount
            ? Number(product.discountPrice)
            : Number(product.price || 0);

          return (
            <div key={product._id} className="rounded-xl bg-white p-4 shadow">
              <div className="flex items-start gap-3">
                <ProductImage product={product} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {product.name}
                    </h3>

                    <EditButton product={product} onEdit={onEdit} />
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {product.category?.name || "No category"}
                  </p>

                  {product.brand && (
                    <p className="text-sm text-gray-500">
                      Brand: {product.brand}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Price</p>
                    <p className="mt-1 text-sm font-medium text-gray-700">
                      ₹{Number(product.price || 0).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Discount Price</p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {hasDiscount
                        ? `₹${Number(product.discountPrice).toFixed(2)}`
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Final Price</p>
                    <p className="mt-1 text-sm font-bold text-indigo-600">
                      ₹{finalPrice.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Stock</p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {product.stock ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-gray-100 pt-3">
                <div>
                  <p className="text-xs text-gray-400">Created</p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">
                    {product.isActive ? "Active" : "Inactive"}
                  </span>

                  <StatusToggle
                    product={product}
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

const ProductImage = ({ product }) => {
  const image = product.productImage?.url || product.image?.url || null;

  if (!image) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
        —
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={product.name}
      className="h-12 w-12 shrink-0 rounded-lg object-cover"
    />
  );
};
const StatusToggle = ({ product, onToggleStatus }) => {
  return (
    <button
      type="button"
      onClick={() => onToggleStatus(product)}
      aria-label={product.isActive ? "Disable product" : "Enable product"}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
        product.isActive ? "bg-green-500" : "bg-red-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          product.isActive ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
};

const EditButton = ({ product, onEdit }) => {
  return (
    <button
      type="button"
      onClick={() => onEdit(product)}
      className="shrink-0 rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
      title="Edit Product"
    >
      <FaEdit size={17} />
    </button>
  );
};

export default ProductTable;
