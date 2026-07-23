import React from "react";
import RatingStars from "../reviews/RatingStars";
import { Link } from "react-router-dom";

const RecentReviewsTable = ({ reviews = [] }) => {
  return (
    <div className="flex flex-col rounded-xl bg-white p-5 shadow">
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h3 className="text-base font-semibold text-gray-800">Recent Customer Reviews</h3>
        <Link to="/reviews" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
          View All →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Review</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  No recent reviews found.
                </td>
              </tr>
            ) : (
              reviews.map((rev) => (
                <tr key={rev._id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {rev.user?.fullName || rev.user?.name || "Customer"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {rev.product?.name || "Product"}
                  </td>
                  <td className="px-4 py-3">
                    <RatingStars rating={rev.rating} size={14} />
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-xs text-gray-600">
                    {rev.comment || rev.review || "No review comment"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentReviewsTable;
