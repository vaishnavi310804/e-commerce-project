import React from "react";
import RatingStars from "../reviews/RatingStars";
import { Link } from "react-router-dom";

const TopProductsTable = ({ products = [] }) => {
  return (
    <div className="flex flex-col rounded-xl bg-white p-5 shadow">
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h3 className="text-base font-semibold text-gray-800">Top Selling Products</h3>
        <Link to="/products" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
          View All →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3 text-center">Sold Units</th>
              <th className="px-4 py-3 text-right">Revenue</th>
              <th className="px-4 py-3 text-center">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  No sales data found.
                </td>
              </tr>
            ) : (
              products.map((prod, idx) => {
                const imgUrl = prod.productImage?.url || prod.image?.url;
                return (
                  <tr key={prod._id || idx} className="hover:bg-gray-50/80">
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
                    <td className="px-4 py-3 text-center font-bold text-gray-800">
                      {prod.soldQuantity}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600">
                      ${Number(prod.revenue || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <RatingStars rating={prod.rating || 5} size={13} />
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

export default TopProductsTable;
