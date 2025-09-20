
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ThumbsUp, MessageSquare, Flag } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import RatingStars from './RatingStars';

// Define review interface
export interface Review {
  id: string;
  reviewerName: string;
  reviewerImage?: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
  isHelpful?: boolean;
}

interface SellerReviewsProps {
  sellerId: string;
  sellerName: string;
  initialReviews?: Review[];
}

const SellerReviews: React.FC<SellerReviewsProps> = ({
  sellerId,
  sellerName,
  initialReviews = []
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews.length > 0 ? initialReviews : [
    {
      id: 'r1',
      reviewerName: 'Amit Kumar',
      reviewerImage: 'https://source.unsplash.com/random/100x100/?portrait&1',
      rating: 4.5,
      comment: 'Great seller! The product was exactly as described and shipping was fast.',
      date: '2 weeks ago',
      helpfulCount: 12
    },
    {
      id: 'r2',
      reviewerName: 'Priya Sharma',
      reviewerImage: 'https://source.unsplash.com/random/100x100/?portrait&2',
      rating: 5,
      comment: 'Excellent communication and service. Would definitely recommend!',
      date: '1 month ago',
      helpfulCount: 8
    },
    {
      id: 'r3',
      reviewerName: 'Rahul Singh',
      rating: 3,
      comment: 'The product was okay but took longer than expected to arrive.',
      date: '2 months ago',
      helpfulCount: 3
    }
  ]);
  
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });
  
  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
    
  // Format average rating to one decimal place
  const formattedRating = averageRating.toFixed(1);
  
  // Mark review as helpful
  const markAsHelpful = (reviewId: string) => {
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === reviewId 
          ? { 
              ...review, 
              helpfulCount: review.isHelpful ? review.helpfulCount - 1 : review.helpfulCount + 1,
              isHelpful: !review.isHelpful 
            } 
          : review
      )
    );
  };
  
  // Submit new review
  const submitReview = () => {
    if (newReview.rating === 0) {
      toast.error('Please provide a rating');
      return;
    }
    
    if (!newReview.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    
    const newReviewObj: Review = {
      id: `r${reviews.length + 1}`,
      reviewerName: 'You',
      rating: newReview.rating,
      comment: newReview.comment,
      date: 'Just now',
      helpfulCount: 0
    };
    
    setReviews([newReviewObj, ...reviews]);
    setNewReview({ rating: 0, comment: '' });
    setShowAddReview(false);
    
    toast.success('Review submitted successfully');
  };
  
  return (
    <div className="space-y-6">
      <div className="bharose-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Reviews & Ratings</h2>
          <Button 
            variant="outline"
            onClick={() => setShowAddReview(!showAddReview)}
          >
            {showAddReview ? 'Cancel' : 'Write a Review'}
          </Button>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="text-center">
            <p className="text-3xl font-bold">{formattedRating}</p>
            <RatingStars rating={averageRating} readonly />
            <p className="text-sm text-muted-foreground mt-1">{reviews.length} reviews</p>
          </div>
          
          <div className="flex-1 grid grid-cols-5 gap-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = reviews.filter(review => Math.floor(review.rating) === star).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm">{star}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {showAddReview && (
          <motion.div 
            className="border rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-medium mb-3">Write Your Review</h3>
            
            <div className="mb-4">
              <label className="block text-sm mb-1">Rating</label>
              <RatingStars 
                rating={newReview.rating} 
                onChange={(rating) => setNewReview(prev => ({ ...prev, rating }))} 
                size="lg"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm mb-1">Comment</label>
              <Textarea 
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience with this seller..."
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                className="mr-2"
                onClick={() => setShowAddReview(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-bharose-primary text-white"
                onClick={submitReview}
              >
                Submit Review
              </Button>
            </div>
          </motion.div>
        )}
        
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={review.reviewerImage} alt={review.reviewerName} />
                  <AvatarFallback>
                    {review.reviewerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{review.reviewerName}</p>
                      <div className="flex items-center mt-1">
                        <RatingStars rating={review.rating} size="sm" readonly />
                        <span className="text-xs text-muted-foreground ml-2">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm mt-2">{review.comment}</p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <button 
                      className={`text-xs flex items-center ${review.isHelpful ? 'text-bharose-primary' : 'text-muted-foreground'}`}
                      onClick={() => markAsHelpful(review.id)}
                    >
                      <ThumbsUp size={14} className="mr-1" />
                      Helpful ({review.helpfulCount})
                    </button>
                    
                    <button className="text-xs flex items-center text-muted-foreground">
                      <MessageSquare size={14} className="mr-1" />
                      Reply
                    </button>
                    
                    <button className="text-xs flex items-center text-muted-foreground">
                      <Flag size={14} className="mr-1" />
                      Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerReviews;
