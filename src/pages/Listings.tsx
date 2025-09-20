
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Edit,
  Trash2,
  Package2,
  Briefcase,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/BottomNavigation';
import { useToast } from '@/hooks/use-toast';
import { useTransactionStore } from '@/utils/transactionState';
import AddListingForm from '@/components/AddListingForm';

const Listings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const userMode = 'Seller'; // In this view, it's always Seller mode
  
  const { listings, removeListing } = useTransactionStore();
  const activeListings = listings.filter(listing => listing.status === 'active');
  
  const [showAddListingForm, setShowAddListingForm] = useState(false);

  // Handle unlist button click
  const handleUnlist = (id: string) => {
    removeListing(id);
    
    toast({
      title: "Listing Removed",
      description: "Your listing has been removed successfully",
    });
  };

  // Handle edit button click
  const handleEdit = (id: string) => {
    // Instead of just showing a toast, navigate to the edit page or open the edit form
    toast({
      title: "Edit Listing",
      description: "Editing functionality would open a form here",
    });
  };
  
  // Handle view listing details
  const handleViewDetails = (id: string) => {
    // Use the correct path format
    navigate(`/listing/${id}`);
  };
  
  // Handle add listing success
  const handleListingSuccess = () => {
    setShowAddListingForm(false);
  };

  return (
    <div className="bharose-container pb-20">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between py-4">
          <h1 className="text-xl font-semibold">Listings</h1>
        </div>
        
        {activeListings.length > 0 ? (
          <div className="space-y-4">
            {activeListings.map((listing) => (
              <motion.div
                key={listing.id}
                className="bharose-card overflow-hidden cursor-pointer"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                onClick={() => handleViewDetails(listing.id)}
              >
                <div className="flex gap-3">
                  <div 
                    className="w-20 h-20 bg-cover bg-center rounded-md flex-shrink-0"
                    style={{ backgroundImage: `url(${listing.image})` }}
                  ></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{listing.title}</h3>
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
                    <p className="text-bharose-primary font-semibold mt-1">
                      ₹{listing.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {listing.terms}
                    </p>
                    <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs px-2 py-1 h-8 border-bharose-primary/30 text-bharose-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(listing.id);
                        }}
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs px-2 py-1 h-8 border-bharose-error/30 text-bharose-error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnlist(listing.id);
                        }}
                      >
                        <Trash2 size={14} className="mr-1" /> Unlist
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <p className="text-muted-foreground text-center mb-4">
              You don't have any listings yet.
            </p>
            <Button onClick={() => setShowAddListingForm(true)}>
              <Plus size={16} className="mr-1" /> Create New Listing
            </Button>
          </div>
        )}
        
        <div className="fixed bottom-20 right-4">
          <Button 
            className="w-14 h-14 rounded-full bg-bharose-secondary text-white flex items-center justify-center shadow-lg"
            onClick={() => setShowAddListingForm(true)}
          >
            <Plus size={24} />
          </Button>
        </div>
        
        {showAddListingForm && (
          <AddListingForm 
            onClose={() => setShowAddListingForm(false)} 
            onSuccess={handleListingSuccess}
          />
        )}
      </motion.div>
      
      <BottomNavigation userMode="Seller" />
    </div>
  );
};

export default Listings;
