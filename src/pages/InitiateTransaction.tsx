import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package2, Briefcase, Search, X, IndianRupee } from 'lucide-react';
import Header from '@/components/Header';
import { toast } from 'sonner';
import { useTransactionStore } from '@/utils/transactionState';
import { Listing } from '@/utils/transactionState';
import { Badge } from '@/components/ui/badge';

const InitiateTransaction = () => {
  const navigate = useNavigate();
  const { addTransaction, getSellerByPhone, getSellerListings } = useTransactionStore();
  
  const [formData, setFormData] = useState({
    sellerPhone: '',
    title: '',
    amount: '',
    description: '',
    terms: 'standard' // 'standard', 'express', 'custom'
  });
  
  const [loading, setLoading] = useState(false);
  const [sellerListings, setSellerListings] = useState<Listing[]>([]);
  const [showListings, setShowListings] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Fetch seller and listings when phone number changes
  useEffect(() => {
    if (formData.sellerPhone.length === 10) {
      const seller = getSellerByPhone(formData.sellerPhone);
      const fetchedListings = getSellerListings(formData.sellerPhone);
      
      setSellerListings(fetchedListings);
      
      if (fetchedListings.length > 0) {
        setShowListings(true);
        if (seller) {
          toast.success(`Found listings from ${seller.name}`);
        }
      } else {
        setShowListings(false);
        
        // Only show toast if it's a valid seller phone number from our dummy data
        if (formData.sellerPhone === '9999990001' || 
            formData.sellerPhone === '9999990002' || 
            formData.sellerPhone === '9999990003') {
          toast.error('No listings found for this seller');
        }
      }
    } else {
      setShowListings(false);
    }
  }, [formData.sellerPhone, getSellerListings, getSellerByPhone]);

  // Handle selecting a listing
  const handleSelectListing = (listing: Listing) => {
    setSelectedListing(listing);
    setFormData({
      ...formData,
      title: listing.title,
      amount: listing.price.toString(),
      description: `${listing.type === 'product' ? 'Product' : 'Service'}: ${listing.title}. Terms: ${listing.terms}`,
    });
    setShowListings(false);
    toast.success('Listing details applied to transaction');
  };

  // Handle clearing selected listing
  const handleClearListing = () => {
    setSelectedListing(null);
    setFormData({
      ...formData,
      title: '',
      amount: '',
      description: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      // Only allow numbers
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sellerPhone || formData.sellerPhone.length !== 10) {
      toast.error('Please enter a valid seller phone number');
      return;
    }
    
    if (!formData.title) {
      toast.error('Please enter a transaction title');
      return;
    }
    
    if (!formData.amount || parseInt(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setLoading(true);
    
    // Add the transaction to our store
    const seller = getSellerByPhone(formData.sellerPhone);
    
    const newTransactionId = addTransaction({
      title: formData.title,
      amount: Number(formData.amount),
      status: 'in-progress',
      role: 'buyer',
      counterparty: seller ? seller.name : `Seller (${formData.sellerPhone})`,
      sellerPhone: formData.sellerPhone,
      description: formData.description
    });
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Transaction initiated successfully!');
      navigate('/payment', { state: { amount: formData.amount, transactionId: newTransactionId } });
    }, 1500);
  };

  return (
    <div className="bharose-container pb-8">
      <Header title="New Transaction" showBack />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4"
      >
        <h2 className="bharose-heading mb-1">Start a Secure Transaction</h2>
        <p className="bharose-subheading">Enter details to create an escrow</p>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Seller's Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                name="sellerPhone"
                value={formData.sellerPhone}
                onChange={handleChange}
                className="bharose-input"
                placeholder="10-digit phone number"
                maxLength={10}
                pattern="[0-9]{10}"
                required
              />
              {formData.sellerPhone.length > 0 && (
                <button 
                  type="button"
                  className="absolute right-3 top-3 text-muted-foreground"
                  onClick={() => setFormData(prev => ({ ...prev, sellerPhone: '' }))}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="mt-2 text-xs text-bharose-primary">
              <p>Try these phone numbers for test listings:</p>
              <p>9999990001 - Tech Solutions</p>
              <p>9999990002 - Creative Studio</p>
              <p>9999990003 - Wellness & Crafts</p>
            </div>
            
            {/* Show seller listings if available */}
            {showListings && sellerListings.length > 0 && (
              <div className="mt-2 space-y-2">
                <p className="text-sm font-medium">Available Listings from Seller:</p>
                <div className="max-h-56 overflow-y-auto space-y-2 border rounded-lg p-2">
                  {sellerListings.map(listing => (
                    <div 
                      key={listing.id}
                      className="p-2 border rounded-md hover:bg-muted cursor-pointer flex items-start gap-2"
                      onClick={() => handleSelectListing(listing)}
                    >
                      <div 
                        className="w-12 h-12 bg-cover bg-center rounded-md flex-shrink-0"
                        style={{ backgroundImage: `url(${listing.image})` }}
                      ></div>
                      <div>
                        <p className="font-medium">{listing.title}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-bharose-primary">₹{listing.price.toLocaleString()}</p>
                          <Badge variant="outline" className={`text-xs ${
                            listing.type === 'product' 
                              ? 'bg-bharose-primary/10 text-bharose-primary' 
                              : 'bg-bharose-secondary/10 text-bharose-secondary'
                          }`}>
                            {listing.type === 'product' ? (
                              <><Package2 size={10} className="mr-1" /> Product</>
                            ) : (
                              <><Briefcase size={10} className="mr-1" /> Service</>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {selectedListing && (
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">Selected Listing:</p>
                  <p>{selectedListing.title}</p>
                  <p className="text-sm text-bharose-primary">₹{selectedListing.price.toLocaleString()}</p>
                </div>
                <button 
                  type="button" 
                  className="text-bharose-error"
                  onClick={handleClearListing}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Transaction Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bharose-input"
              placeholder="e.g. iPhone 13 Purchase"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Amount (Rs.)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="bharose-input pl-10"
                placeholder="0"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bharose-input min-h-[100px]"
              placeholder="Include details about the transaction"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Choose Terms</label>
            <div className="space-y-3">
              {[
                { 
                  id: 'standard', 
                  title: 'Standard',
                  desc: '7-day delivery, inspection period of 3 days'
                },
                { 
                  id: 'express', 
                  title: 'Express',
                  desc: '3-day delivery, inspection period of 1 day'
                },
                { 
                  id: 'custom', 
                  title: 'Custom',
                  desc: 'Set custom delivery and inspection periods'
                }
              ].map((option) => (
                <div 
                  key={option.id}
                  className={`p-3 rounded-lg border-2 ${
                    formData.terms === option.id
                      ? 'border-bharose-primary bg-bharose-light'
                      : 'border-border'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, terms: option.id }))}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                      formData.terms === option.id
                        ? 'bg-bharose-primary'
                        : 'border border-muted-foreground'
                    }`}>
                      {formData.terms === option.id && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="font-medium">{option.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 ml-6">{option.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <motion.button
            type="submit"
            className="bharose-primary-button w-full mt-6"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </span>
            ) : (
              'Proceed to Payment'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default InitiateTransaction;
