
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/BottomNavigation';
import { useTransactionStore } from '@/utils/transactionState';

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { listings } = useTransactionStore();
  
  // Get userMode from location state if available
  const userMode = location.state?.userMode || 'Seller';
  
  const listing = listings.find(listing => listing.id === id);
  
  if (!listing) {
    return (
      <div className="bharose-container pb-20">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 py-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold">Listing Not Found</h1>
          </div>
          
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <p className="text-muted-foreground text-center mb-4">
              The listing you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/listings', { state: { userMode } })}>
              Back to Listings
            </Button>
          </div>
        </motion.div>
        
        <BottomNavigation userMode={userMode} />
      </div>
    );
  }

  return (
    <div className="bharose-container pb-20">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 py-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">Listing Details</h1>
        </div>
        
        <div className="bharose-card mt-4">
          <div 
            className="w-full h-48 bg-cover bg-center rounded-t-md"
            style={{ backgroundImage: `url(${listing.image})` }}
          ></div>
          
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">{listing.title}</h2>
              <Badge variant="outline" className={`${
                listing.type === 'product' 
                  ? 'bg-bharose-primary/10 text-bharose-primary' 
                  : 'bg-bharose-secondary/10 text-bharose-secondary'
              }`}>
                {listing.type === 'product' ? (
                  <><Package2 size={12} className="mr-1" /> Product</>
                ) : (
                  <><Briefcase size={12} className="mr-1" /> Service</>
                )}
              </Badge>
            </div>
            
            <p className="text-bharose-primary font-semibold mt-4 text-2xl">
              ₹{listing.price.toLocaleString()}
            </p>
            
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Description</h3>
              <p className="text-muted-foreground">
                {listing.description || "No description provided."}
              </p>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Terms</h3>
              <p className="text-muted-foreground">
                {listing.terms || "No specific terms provided."}
              </p>
            </div>
            
            <div className="mt-8">
              <Button onClick={() => navigate('/initiate-transaction', { state: { listing, userMode } })}>
                Start Transaction
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
      
      <BottomNavigation userMode={userMode} />
    </div>
  );
};

export default ListingDetails;
