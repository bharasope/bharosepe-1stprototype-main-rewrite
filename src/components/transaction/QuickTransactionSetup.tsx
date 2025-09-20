import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, X, IndianRupee, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransactionStore } from '@/utils/transactionState';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface QuickTransactionData {
  sellerPhone: string;
  title: string;
  amount: string;
  description: string;
  deliveryDate: string;
}

const QuickTransactionSetup = () => {
  const navigate = useNavigate();
  const { addTransaction, getSellerByPhone, getSellerListings } = useTransactionStore();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [data, setData] = useState<QuickTransactionData>({
    sellerPhone: '',
    title: '',
    amount: '',
    description: '',
    deliveryDate: ''
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Auto-fetch seller data when phone is entered
  useEffect(() => {
    if (data.sellerPhone.length === 10) {
      const listings = getSellerListings(data.sellerPhone);
      setSuggestions(listings);
      setShowSuggestions(listings.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [data.sellerPhone, getSellerListings]);

  const handlePhoneComplete = () => {
    if (data.sellerPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    setStep(2);
  };

  const handleSelectSuggestion = (listing: any) => {
    setData(prev => ({
      ...prev,
      title: listing.title,
      amount: listing.price.toString(),
      description: `${listing.type}: ${listing.title}`
    }));
    setShowSuggestions(false);
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!data.title || !data.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const seller = getSellerByPhone(data.sellerPhone);
      
      const transactionId = addTransaction({
        title: data.title,
        amount: Number(data.amount),
        status: 'in-progress',
        role: 'buyer',
        counterparty: seller ? seller.name : `Seller (${data.sellerPhone})`,
        sellerPhone: data.sellerPhone,
        description: data.description
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Transaction created successfully!');
      navigate('/payment', { 
        state: { 
          amount: data.amount, 
          transactionId 
        } 
      });
    } catch (error) {
      toast.error('Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof QuickTransactionData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bharose-card max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Quick Transaction</h2>
        <div className="flex gap-1">
          {[1, 2].map(i => (
            <div 
              key={i}
              className={`w-2 h-2 rounded-full ${
                step >= i ? 'bg-bharose-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium mb-2 block">
                Seller's Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={data.sellerPhone}
                  onChange={(e) => updateField('sellerPhone', e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit number"
                  maxLength={10}
                  className="bharose-input pr-8"
                />
                {data.sellerPhone && (
                  <button
                    onClick={() => updateField('sellerPhone', '')}
                    className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              {/* Test numbers hint */}
              <div className="mt-2 text-xs text-muted-foreground">
                Test: 9999990001, 9999990002, 9999990003
              </div>
            </div>

            {/* Suggestions */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <p className="text-xs font-medium text-bharose-primary">Quick Select:</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {suggestions.slice(0, 3).map(listing => (
                      <button
                        key={listing.id}
                        onClick={() => handleSelectSuggestion(listing)}
                        className="w-full text-left p-2 rounded border hover:bg-muted transition-colors"
                      >
                        <div className="font-medium text-sm">{listing.title}</div>
                        <div className="text-xs text-bharose-primary">₹{listing.price.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              onClick={handlePhoneComplete}
              className="w-full bharose-primary-button"
              disabled={data.sellerPhone.length !== 10}
            >
              Continue <ArrowRight size={16} className="ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium mb-2 block">Transaction Title *</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. iPhone 13 Purchase"
                className="bharose-input"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Amount (₹) *</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={data.amount}
                  onChange={(e) => updateField('amount', e.target.value.replace(/\D/g, ''))}
                  placeholder="0"
                  className="bharose-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Expected Delivery</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={data.deliveryDate}
                  onChange={(e) => updateField('deliveryDate', e.target.value)}
                  className="bharose-input pl-10"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea
                value={data.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Brief description of the transaction"
                className="bharose-input min-h-[60px] resize-none"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={loading || !data.title || !data.amount}
                className="flex-1 bharose-primary-button"
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </span>
                ) : (
                  'Create Transaction'
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickTransactionSetup;