import React, { useState } from 'react';

const Rating = ({ rating, onRate, numRatings, averageRating, ratingInProgress }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="rating">
      <div>
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            className={`star ${value <= (hoverRating || rating) ? 'filled' : ''}`}
            onClick={() => !ratingInProgress && onRate(value)}
            onMouseEnter={() => !ratingInProgress && setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            style={{ cursor: ratingInProgress ? 'not-allowed' : 'pointer' }}
          >
            ★
          </span>
        ))}
      </div>
      <div className="rating-info">
        <p>{numRatings} rating{numRatings !== 1 && 's'}</p>
        <p>Average: {averageRating.toFixed(1)}</p>
      </div>
    </div>
  );
};

export default Rating;
