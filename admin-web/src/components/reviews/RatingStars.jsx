import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const RatingStars = ({ rating = 0, size = 16 }) => {
  const stars = [];
  const numericRating = Math.round(Number(rating) || 0);

  for (let i = 1; i <= 5; i++) {
    if (i <= numericRating) {
      stars.push(
        <FaStar key={i} size={size} className="text-amber-400 fill-current" />
      );
    } else {
      stars.push(
        <FaRegStar key={i} size={size} className="text-gray-300" />
      );
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>;
};

export default RatingStars;
