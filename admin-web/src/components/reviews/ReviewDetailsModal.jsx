import React from "react";
import { FaTimes, FaEyeSlash, FaEye, FaTrash, FaBox, FaUser } from "react-icons/fa";
import RatingStars from "./RatingStars";

const ReviewDetailsModal = ({
  open,
  onClose,
  review,
  onToggleHide,
  onDelete,
}) => {
  if (!open || !review) return null;

  const prodImage =
    review.product?.productImage?.url || review.product?.image?.url;
  const reviewText = review.comment || review.review || "No comment provided.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Review Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <FaBox className="text-indigo-600" />
              Product Information
            </div>
            <div className="flex items-center gap-4">
              {prodImage ? (
                <img
                  src={prodImage}
                  alt={review.product?.name}
                  className="h-14 w-14 rounded-lg object-cover border"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-400">
                  N/A
                </div>
              )}
              <div>
                <h4 className="font-bold text-gray-900">
                  {review.product?.name || "Deleted Product"}
                </h4>
                {review.product?.brand && (
                  <p className="text-xs text-gray-500">Brand: {review.product.brand}</p>
                )}
                {review.product?.price && (
                  <p className="text-sm font-semibold text-indigo-600">
                    ${Number(review.product.price).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <FaUser className="text-indigo-600" />
              Customer Information
            </div>
            <div className="flex items-center gap-3">
              {review.user?.profileImage ? (
                <img
                  src={review.user.profileImage}
                  alt={review.user.fullName}
                  className="h-10 w-10 rounded-full object-cover border"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                  {review.user?.fullName?.charAt(0).toUpperCase() || "C"}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {review.user?.fullName || review.user?.name || "Anonymous Customer"}
                </p>
                <p className="text-xs text-gray-500">
                  {review.user?.email || "No email"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <div>
                <RatingStars rating={review.rating} size={20} />
                <p className="mt-1 text-xs text-gray-500">
                  Posted on {new Date(review.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                  review.isHidden
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                {review.isHidden ? "Hidden" : "Visible"}
              </span>
            </div>

            <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
              {reviewText}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="flex gap-2">
            <button
              onClick={() => onToggleHide(review)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
                review.isHidden
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {review.isHidden ? (
                <>
                  <FaEye /> Unhide Review
                </>
              ) : (
                <>
                  <FaEyeSlash /> Hide Review
                </>
              )}
            </button>

            <button
              onClick={() => onDelete(review)}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              <FaTrash /> Delete Review
            </button>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailsModal;
