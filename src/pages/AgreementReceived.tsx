
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { CheckCircle, XCircle, FileText, User, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useEnhancedTransactionStore } from '@/utils/enhancedTransactionState';
import { useProfileManager } from '@/hooks/use-profile-manager';

const AgreementReceived = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [feedback, setFeedback] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { agreements, updateAgreementStatus } = useEnhancedTransactionStore();
  const { currentProfile } = useProfileManager();

  // Find the agreement by ID
  const agreement = agreements.find(a => a.id === id);

  if (!agreement) {
    return (
      <div className="bharose-container">
        <Header title="Agreement Not Found" showBack />
        <div className="bharose-card mt-4 text-center">
          <p>Agreement not found or you don't have permission to view it.</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Check if current user is either sender or receiver
  const isReceiver = agreement.receiverProfileId === currentProfile.id;
  const isSender = agreement.senderProfileId === currentProfile.id;
  
  if (!isReceiver && !isSender) {
    return (
      <div className="bharose-container">
        <Header title="Access Denied" showBack />
        <div className="bharose-card mt-4 text-center">
          <p>You don't have permission to view this agreement.</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleAccept = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateAgreementStatus(agreement.id, 'accepted', feedback || 'Agreement accepted');
    toast.success('Agreement accepted! Redirecting to payment...');
    
    setTimeout(() => {
      // Redirect to payment page
      navigate('/payment', { 
        state: { 
          amount: agreement.amount.toString(),
          transactionId: agreement.transactionId
        } 
      });
    }, 1000);
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateAgreementStatus(agreement.id, 'rejected', feedback);
    toast.success('Agreement rejected. Sender has been notified.');
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="bharose-container pb-8">
      <Header title={isReceiver ? "Agreement Received" : "Agreement Details"} showBack />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4"
      >
        {/* Agreement Header */}
        <div className="bharose-card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-bharose-primary/10 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-bharose-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{agreement.transactionTitle}</h2>
              <p className="text-muted-foreground">Transaction Agreement</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-2xl font-bold text-bharose-primary">
                ₹{agreement.amount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User size={16} className="text-muted-foreground" />
              <span className="text-sm">From: {agreement.senderName}</span>
              <span className="text-xs text-muted-foreground">({agreement.senderPhone})</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-muted-foreground" />
              <span className="text-sm">
                Sent: {new Date(agreement.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Agreement Details */}
        <div className="bharose-card mb-6">
          <h3 className="font-semibold mb-3">Agreement Details</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Description</h4>
              <p className="text-sm whitespace-pre-wrap">{agreement.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Terms & Conditions</h4>
              <p className="text-sm">{agreement.terms}</p>
            </div>

            <div className="bg-bharose-light rounded-lg p-4">
              <div className="flex items-start gap-3">
                <DollarSign className="text-bharose-primary mt-0.5" size={18} />
                <div>
                  <h4 className="font-medium text-sm">Escrow Protection</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your payment will be held securely until you confirm receipt of goods/services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Only show actions if agreement is still pending AND user is receiver */}
        {agreement.status === 'pending' && isReceiver && (
          <>
            {/* Feedback Section */}
            <div className="bharose-card mb-6">
              <h3 className="font-semibold mb-3">Your Response</h3>
              <Textarea
                placeholder="Add any comments or concerns about this agreement (optional for acceptance, required for rejection)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAccept}
                disabled={isProcessing}
                className="w-full bg-bharose-success hover:bg-bharose-success/90 text-white"
              >
                <CheckCircle size={18} className="mr-2" />
                {isProcessing ? 'Processing...' : 'Accept & Proceed to Payment'}
              </Button>

              <Button
                variant="outline"
                onClick={handleReject}
                disabled={isProcessing}
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle size={18} className="mr-2" />
                {isProcessing ? 'Processing...' : 'Reject Agreement'}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              By accepting, you agree to proceed with this transaction under escrow protection.
            </p>
          </>
        )}

        {/* Show status if not pending */}
        {agreement.status !== 'pending' && (
          <div className="bharose-card">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                agreement.status === 'accepted' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {agreement.status === 'accepted' ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
              <h3 className="font-semibold mb-2">
                Agreement {agreement.status === 'accepted' ? 'Accepted' : 'Rejected'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {agreement.respondedAt && `On ${new Date(agreement.respondedAt).toLocaleDateString()}`}
              </p>
              {agreement.feedback && (
                <div className="text-left bg-muted rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-1">Response:</h4>
                  <p className="text-sm">{agreement.feedback}</p>
                </div>
              )}
              {agreement.status === 'accepted' && agreement.transactionId && isReceiver && (
                <Button
                  onClick={() => navigate('/payment', { 
                    state: { 
                      amount: agreement.amount.toString(),
                      transactionId: agreement.transactionId
                    } 
                  })}
                  className="mt-4 bg-bharose-primary hover:bg-bharose-primary/90"
                >
                  Proceed to Payment
                </Button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AgreementReceived;
