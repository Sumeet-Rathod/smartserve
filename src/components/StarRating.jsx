import React, { useState } from "react";
import { Star } from "lucide-react";

export const StarRating = ({ rating = 5, totalStars = 5, interactive = false, onRatingChange, size = "md" }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };

  const iconSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, i) => {
        const starNumber = i + 1;
        const isFilled = interactive 
          ? (hoverRating ? hoverRating >= starNumber : rating >= starNumber)
          : rating >= starNumber;
        const isPartial = !interactive && !isFilled && rating > i && rating < starNumber;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starNumber)}
            onMouseEnter={() => interactive && setHoverRating(starNumber)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? "cursor-pointer transform hover:scale-110 transition-transform" : "cursor-default"} focus:outline-none`}
          >
            <Star
              className={`${iconSize} ${
                isFilled
                  ? "text-gold fill-gold"
                  : isPartial
                  ? "text-gold fill-gold/50"
                  : "text-slate-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
