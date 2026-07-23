import React from "react";
import { FaEye, FaEyeSlash, FaTrash, FaCheck } from "react-icons/fa";
import RatingStars from "./RatingStars";

const ReviewTable = ({
  reviews,
  loading,
  selectedIds = [],
  onSelectAll,
  onSelectOne,
  onViewReview,
  onToggleHide,
  onDeleteReview,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        Loading reviews...
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        No reviews found.
      </div>
    );
  }

  const allSelected =
    reviews.length > 0 && selectedIds.length === reviews.length;

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-[1100px] w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-4 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Product Image
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Product Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Customer Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Rating
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Review
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Date
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {reviews.map((rev) => {
            const isSelected = selectedIds.includes(rev._id);
            const prodImage =
              rev.product?.productImage?.url || rev.product?.image?.url;
            const reviewText = rev.comment || rev.review || "No comment";

            return (
              <tr
                key={rev._id}
                className={`transition hover:bg-gray-50/80 ${
                  isSelected ? "bg-indigo-50/50" : ""
                }`}
              >
                <td className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectOne(rev._id)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {prodImage ? (
                    <img
                      src={prodImage}
                      alt={rev.product?.name}
                      className="h-10 w-10 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                      N/A
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {rev.product?.name || "Deleted Product"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {rev.user?.fullName || rev.user?.name || "Anonymous Customer"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <RatingStars rating={rev.rating} />
                </td>

                <td className="px-6 py-4 max-w-xs truncate text-gray-600">
                  {reviewText}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      rev.isHidden
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {rev.isHidden ? "Hidden" : "Visible"}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewReview(rev)}
                      className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                      title="View Details"
                    >
                      <FaEye size={17} />
                    </button>

                    <button
                      onClick={() => onToggleHide(rev)}
                      className={`rounded-lg p-2 transition ${
                        rev.isHidden
                          ? "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          : "text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                      }`}
                      title={rev.isHidden ? "Unhide Review" : "Hide Review"}
                    >
                      {rev.isHidden ? <FaCheck size={17} /> : <FaEyeSlash size={17} />}
                    </button>

                    <button
                      onClick={() => onDeleteReview(rev)}
                      className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
                      title="Delete Review"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewTable;
