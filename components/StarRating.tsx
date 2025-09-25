
import React from 'react';

interface StarRatingProps {
  rating: number;
  reviewCount: number;
}

const StarIcon: React.FC<{ filled: boolean; half: boolean }> = ({ filled, half }) => (
    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        {half ? (
            <>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                <path d="M10 15.27L16.18 19l-1.64-7.03L22 7.24l-7.19-.61L12 2 9.19 6.63 2 7.24l5.46 4.73L5.82 19z" style={{ fill: 'none' }} />
            </>
        ) : filled ? (
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        ) : (
            <path d="M10 15.27L16.18 19l-1.64-7.03L22 7.24l-7.19-.61L12 2 9.19 6.63 2 7.24l5.46 4.73L5.82 19z" fill="none" stroke="currentColor" strokeWidth="2"/>
        )}
    </svg>
);

const StarRating: React.FC<StarRatingProps> = ({ rating, reviewCount }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<StarIcon key={i} filled={true} half={false} />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<StarIcon key={i} filled={false} half={true} />);
    } else {
      stars.push(<StarIcon key={i} filled={false} half={false} />);
    }
  }

  return (
    <div className="flex items-center">
      <div className="flex items-center">{stars}</div>
      <span className="text-gray-500 text-sm ml-2">({reviewCount} reviews)</span>
    </div>
  );
};

export default StarRating;
