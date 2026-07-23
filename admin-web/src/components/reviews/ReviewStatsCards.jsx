import React from "react";
import {
  FaComments,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaSmile,
  FaFrown,
} from "react-icons/fa";

const ReviewStatsCards = ({ stats }) => {
  const {
    totalReviews = 0,
    visibleReviews = 0,
    hiddenReviews = 0,
    averageRating = "0.0",
    fiveStarReviews = 0,
    oneStarReviews = 0,
  } = stats || {};

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow border-l-4 border-indigo-500">
        <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
          <FaComments size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">Total Reviews</p>
          <h3 className="text-xl font-bold text-gray-800">{totalReviews}</h3>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow border-l-4 border-emerald-500">
        <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
          <FaEye size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">Visible</p>
          <h3 className="text-xl font-bold text-gray-800">{visibleReviews}</h3>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow border-l-4 border-rose-500">
        <div className="rounded-lg bg-rose-50 p-3 text-rose-600">
          <FaEyeSlash size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">Hidden</p>
          <h3 className="text-xl font-bold text-gray-800">{hiddenReviews}</h3>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow border-l-4 border-amber-500">
        <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
          <FaStar size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">Avg Rating</p>
          <h3 className="text-xl font-bold text-gray-800">{averageRating}</h3>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow border-l-4 border-purple-500">
        <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
          <FaSmile size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">5-Star</p>
          <h3 className="text-xl font-bold text-gray-800">{fiveStarReviews}</h3>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow border-l-4 border-gray-500">
        <div className="rounded-lg bg-gray-100 p-3 text-gray-600">
          <FaFrown size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">1-Star</p>
          <h3 className="text-xl font-bold text-gray-800">{oneStarReviews}</h3>
        </div>
      </div>
    </div>
  );
};

export default ReviewStatsCards;
