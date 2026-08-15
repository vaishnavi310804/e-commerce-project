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
    <>
      <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
        <div className="overflow-x-auto">
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
                      <ProductImage
                        image={prodImage}
                        name={rev.product?.name}
                      />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {rev.product?.name || "Deleted Product"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {rev.user?.fullName ||
                        rev.user?.name ||
                        "Anonymous Customer"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <RatingStars rating={rev.rating} />
                    </td>

                    <td className="max-w-xs px-6 py-4 text-gray-600">
                      <p className="truncate">{reviewText}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ReviewStatus review={rev} />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {rev.createdAt
                        ? new Date(rev.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <ReviewActions
                        review={rev}
                        onViewReview={onViewReview}
                        onToggleHide={onToggleHide}
                        onDeleteReview={onDeleteReview}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {reviews.map((rev) => {
          const isSelected = selectedIds.includes(rev._id);

          const prodImage =
            rev.product?.productImage?.url || rev.product?.image?.url;

          const reviewText = rev.comment || rev.review || "No comment";

          const customerName =
            rev.user?.fullName || rev.user?.name || "Anonymous Customer";

          return (
            <div
              key={rev._id}
              className={`rounded-xl bg-white p-4 shadow transition ${
                isSelected ? "ring-2 ring-indigo-200" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelectOne(rev._id)}
                  className="mt-2 h-4 w-4 shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />

                <ProductImage image={prodImage} name={rev.product?.name} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        {rev.product?.name || "Deleted Product"}
                      </h3>

                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {customerName}
                      </p>
                    </div>

                    <ReviewActions
                      review={rev}
                      onViewReview={onViewReview}
                      onToggleHide={onToggleHide}
                      onDeleteReview={onDeleteReview}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                <div>
                  <p className="mb-1 text-xs text-gray-400">Rating</p>

                  <RatingStars rating={rev.rating} />
                </div>

                <div>
                  <p className="mb-1 text-xs text-gray-400">Status</p>

                  <ReviewStatus review={rev} />
                </div>
              </div>

              <div className="mt-4 rounded-lg p-3">
                <p className="mb-1 text-xs font-medium text-gray-400">Review</p>

                <p className="text-sm leading-5 text-gray-700 break-words">
                  {reviewText}
                </p>
              </div>

              <div className="mt-3 text-xs text-gray-400">
                {rev.createdAt
                  ? new Date(rev.createdAt).toLocaleDateString()
                  : "—"}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
const ProductImage = ({ image, name }) => {
  if (image) {
    return (
      <img
        src={image}
        alt={name || "Product"}
        className="h-10 w-10 shrink-0 rounded-lg border object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
      N/A
    </div>
  );
};
const ReviewStatus = ({ review }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        review.isHidden
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {review.isHidden ? "Hidden" : "Visible"}
    </span>
  );
};

const ReviewActions = ({
  review,
  onViewReview,
  onToggleHide,
  onDeleteReview,
}) => {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={() => onViewReview(review)}
        className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
        title="View Details"
      >
        <FaEye size={16} />
      </button>

      <button
        type="button"
        onClick={() => onToggleHide(review)}
        className={`rounded-lg p-2 transition ${
          review.isHidden
            ? "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
            : "text-amber-600 hover:bg-amber-50 hover:text-amber-700"
        }`}
        title={review.isHidden ? "Unhide Review" : "Hide Review"}
      >
        {review.isHidden ? <FaCheck size={16} /> : <FaEyeSlash size={16} />}
      </button>
      <button
        type="button"
        onClick={() => onDeleteReview(review)}
        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700"
        title="Delete Review"
      >
        <FaTrash size={15} />
      </button>
    </div>
  );
};

export default ReviewTable;
