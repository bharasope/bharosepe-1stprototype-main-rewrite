import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import { toast } from 'sonner';

interface LocationState {
  amount: string;
  transactionId?: string; // Make transactionId optional for backward compatibility
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState<string>('0');
  const [transactionId, setTransactionId] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (state && state.amount) {
      setAmount(state.amount);
    }
    
    if (state && state.transactionId) {
      setTransactionId(state.transactionId);
    }
  }, [state]);
  
  const handlePayment = () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success('Payment successful!');
      
      // Redirect to the transaction page after 2 seconds
      setTimeout(() => {
        // If we have a transaction ID, redirect to it, otherwise go to dashboard
        if (transactionId) {
          navigate(`/transaction-status/${transactionId}`);
        } else {
          navigate('/dashboard');
        }
      }, 2000);
    }, 2000);
  };
  
  return (
    <div className="bharose-container">
      <Header title="Payment" showBack />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4"
      >
        <div className="bharose-card text-center py-12">
          {success ? (
            <>
              <CheckCircle size={60} className="text-bharose-success mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground">
                Redirecting you to the transaction details...
              </p>
            </>
          ) : (
            <>
              <Lock size={60} className="text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Confirm Payment</h2>
              <p className="text-muted-foreground">
                You are about to pay ₹{Number(amount).toLocaleString()}
              </p>
              
              <button
                className="bharose-primary-button mt-6"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  'Pay Now'
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Payment;
