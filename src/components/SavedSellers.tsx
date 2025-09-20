
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, StarOff, Phone, MessageSquare, ShoppingBag } from 'lucide-react';
import { Seller } from '@/utils/transactionState';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface SavedSellersProps {
  sellers: Seller[];
}

const SavedSellers: React.FC<SavedSellersProps> = ({ sellers }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedSellerIds, setSavedSellerIds] = useState<string[]>(['SELLER001']); // Default saved seller for demo
  
  const toggleSaveSeller = (sellerId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (savedSellerIds.includes(sellerId)) {
      setSavedSellerIds(savedSellerIds.filter(id => id !== sellerId));
      
      toast({
        title: "Seller removed",
        description: "Seller has been removed from your saved list",
      });
    } else {
      setSavedSellerIds([...savedSellerIds, sellerId]);
      
      toast({
        title: "Seller saved",
        description: "Seller has been added to your saved list",
      });
    }
  };
  
  const handleSellerClick = (sellerId: string) => {
    // Navigate to seller's listings
    navigate(`/listings?seller=${sellerId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Saved Sellers</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-muted-foreground"
          onClick={() => navigate('/listings')}
        >
          View All
        </Button>
      </div>
      
      {sellers.filter(seller => savedSellerIds.includes(seller.id)).length === 0 ? (
        <div className="bharose-card flex flex-col items-center justify-center py-6 text-center">
          <StarOff size={32} className="text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No saved sellers yet</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={() => navigate('/listings')}
          >
            Browse Sellers
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {sellers.filter(seller => savedSellerIds.includes(seller.id)).map((seller) => (
            <motion.div
              key={seller.id}
              className="bharose-card cursor-pointer"
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              onClick={() => handleSellerClick(seller.id)}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{seller.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ShoppingBag size={14} className="mr-1" />
                    <span>{seller.listings.length} listings</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-bharose-secondary"
                  onClick={(e) => toggleSaveSeller(seller.id, e)}
                >
                  <Star size={18} fill={savedSellerIds.includes(seller.id) ? "currentColor" : "none"} />
                </Button>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    // In a real app, this would open the phone app
                    toast({
                      title: "Calling seller",
                      description: `Calling ${seller.name} at ${seller.phone}`,
                    });
                  }}
                >
                  <Phone size={14} className="mr-1" /> Call
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/initiate-transaction', { state: { sellerPhone: seller.phone } });
                  }}
                >
                  <ShoppingBag size={14} className="mr-1" /> Buy
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSellers;
