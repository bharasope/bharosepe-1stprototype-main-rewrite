
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (rating: number) => void;
  readonly?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  onChange,
  readonly = false
}) => {
  const stars = [];
  
  // Get star size based on size prop
  const getStarSize = () => {
    switch(size) {
      case 'sm': return 14;
      case 'lg': return 24;
      default: return 18;
    }
  };
  
  // Get CSS classes based on size prop
  const getContainerClasses = () => {
    switch(size) {
      case 'sm': return 'gap-1';
      case 'lg': return 'gap-2';
      default: return 'gap-1.5';
    }
  };
  
  // Handle star click
  const handleStarClick = (index: number) => {
    if (!readonly && onChange) {
      onChange(index + 1);
    }
  };

  // Render stars
  for (let i = 0; i < maxRating; i++) {
    const isFilled = i < Math.floor(rating);
    const isHalfFilled = i === Math.floor(rating) && rating % 1 !== 0;
    
    stars.push(
      <button
        key={i}
        type="button"
        onClick={() => handleStarClick(i)}
        disabled={readonly}
        className={cn(
          "relative focus:outline-none transition-opacity",
          readonly ? "cursor-default" : "cursor-pointer hover:opacity-100"
        )}
      >
        <Star
          size={getStarSize()}
          className={cn(
            "transition-colors",
            isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-200",
            !readonly && "hover:fill-yellow-400 hover:text-yellow-400"
          )}
        />
        {isHalfFilled && (
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star
              size={getStarSize()}
              className="fill-yellow-400 text-yellow-400"
            />
          </div>
        )}
      </button>
    );
  }

  return (
    <div className={`flex items-center ${getContainerClasses()}`}>
      {stars}
    </div>
  );
};

export default RatingStars;
