import { useState } from "react";
import starFilled from "../assets/star-full-svgrepo-com.svg";
import starEmpty from "../assets/star-empty-svgrepo-com.svg";
import "./StarRating.css";

function StarRating({ rating, setRating }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hover || rating);

        return (
          <img
            key={star}
            src={isFilled ? starFilled : starEmpty}
            alt="star"
            className="star"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          />
        );
      })}
    </div>
  );
}

export default StarRating;
