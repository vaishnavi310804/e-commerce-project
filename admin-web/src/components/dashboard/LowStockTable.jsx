import React from "react";
import { Link } from "react-router-dom";

const LowStockTable = ({ products = [] }) => {
  return (
    <div className="flex flex-col rounded-xl bg-white p-5 shadow">
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h3 className="text-base font-semibold text-rose-700 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          Low Stock Alerts
        </h3>
        <Link to="/products" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
          Manage Inventory →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-center">Current Stock</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-emerald-600 font-medium">
                  All inventory levels are healthy!
                </td>
              </tr>
            ) : (
              products.map((prod) => {
                const imgUrl = prod.productImage?.url || prod.image?.url;
                const isOutOfStock = prod.stock <= 0;

                return (
                  <tr key={prod._id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={prod.name}
                            className="h-10 w-10 rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                            N/A
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{prod.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {prod.category?.name || "General"}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-gray-800">
                      {prod.stock}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isOutOfStock
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isOutOfStock ? "Out of Stock" : "Low Stock"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockTable;
