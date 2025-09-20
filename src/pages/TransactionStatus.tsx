import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import StatusTimeline from '@/components/StatusTimeline';
import DeliveryProofUpload from '@/components/DeliveryProofUpload';
import DeliveryConfirmation from '@/components/DeliveryConfirmation';
import { Phone, Mail, MessageSquare, Flag, ShieldCheck, CheckCircle, Send, Home, Upload, FileCheck, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useTransactionStore, TransactionStatus as TxStatus } from '@/utils/transactionState';
import { useEnhancedTransactionStore } from '@/utils/enhancedTransactionState';
import { useProfileManager } from '@/hooks/use-profile-manager';

const TransactionStatus = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [showCompleteConfirmation, setShowCompleteConfirmation] = useState(false);
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [showDeliveryUpload, setShowDeliveryUpload] = useState(false);
  const [showDeliveryConfirmation, setShowDeliveryConfirmation] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{text: string, sender: 'user' | 'support', time: string}[]>([]);
  
  const userMode = location.state?.userMode || 'Buyer';
  const { currentProfile } = useProfileManager();
  const { transactions, updateTransactionStatus } = useTransactionStore();
  const { 
    enhancedTransactions, 
    updateTransactionStatus: updateEnhancedStatus,
    getTransactionStatus 
  } = useEnhancedTransactionStore();
  
  const transaction = transactions.find(tx => tx.id === id);
  const enhancedTransaction = enhancedTransactions.find(tx => tx.id === id);
  const currentStatus = enhancedTransaction ? getTransactionStatus(id!) : 'contract_sent';
  
  useEffect(() => {
    if (!transaction) {
      toast.error('Transaction not found');
      navigate('/transactions', { state: { userMode } });
    }
  }, [transaction, navigate, userMode]);
  
  const handleComplete = () => {
    if (id) {
      updateTransactionStatus(id, 'completed');
      updateEnhancedStatus(id, 'completed', currentProfile.id);
      toast.success('Transaction marked as complete!');
      setShowCompleteConfirmation(false);
      navigate('/dashboard');
    }
  };
  
  const handleRaiseDispute = () => {
    navigate(`/dispute/${id}`, { state: { transactionId: id, userMode } });
  };

  const handleHomeNavigation = () => {
    navigate('/dashboard');
  };

  const handleContractAccept = () => {
    if (id) {
      updateEnhancedStatus(id, 'contract_accepted', currentProfile.id);
      toast.success('Contract accepted! Please proceed with payment.');
    }
  };

  const handlePaymentMade = () => {
    if (id) {
      updateEnhancedStatus(id, 'payment_made', currentProfile.id);
      toast.success('Payment confirmed! Seller has been notified.');
    }
  };

  const handleDeliveryUploadComplete = () => {
    setShowDeliveryUpload(false);
    if (id) {
      updateEnhancedStatus(id, 'delivered', currentProfile.id);
      toast.success('Delivery proof uploaded! Buyer has been notified.');
    }
  };

  const handleDeliveryConfirmed = () => {
    setShowDeliveryConfirmation(false);
    if (id) {
      updateEnhancedStatus(id, 'completed', currentProfile.id);
      handleComplete();
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newUserMessage = {
      text: chatMessage,
      sender: 'user' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatMessage('');
    
    setTimeout(() => {
      const supportResponse = {
        text: "Thank you for contacting support. We're reviewing your dispute and will get back to you within 24 hours.",
        sender: 'support' as const,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, supportResponse]);
    }, 1000);
  };

  if (!transaction) {
    return (
      <div className="bharose-container">
        <Header title="Transaction Details" showBack />
        <div className="mt-8 text-center">
          <p>Transaction not found or loading...</p>
        </div>
      </div>
    );
  }

  const isSeller = currentProfile.role === 'Seller';
  const isBuyer = currentProfile.role === 'Buyer';

  return (
    <div className="bharose-container pb-6">
      <Header title="Transaction Details" showBack />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4"
      >
        <div className="bharose-card mb-6">
          <h2 className="text-xl font-semibold mb-1">{transaction.title}</h2>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Transaction ID: {transaction.id}</span>
            <span className="text-bharose-primary font-medium">₹{transaction.amount.toLocaleString()}</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <h3 className="font-medium mb-2">
              {transaction.role === 'buyer' ? 'Seller' : 'Buyer'} Details
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">{transaction.counterparty}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Phone size={16} className="text-muted-foreground mr-2" />
                  <span className="text-sm">
                    {transaction.role === 'buyer' ? 
                      (transaction.sellerPhone || 'N/A') : 
                      (transaction.buyerPhone || 'N/A')}
                  </span>
                </div>
                <button className="text-bharose-primary text-sm">Call</button>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Mail size={16} className="text-muted-foreground mr-2" />
                  <span className="text-sm">
                    {transaction.role === 'buyer' ? 
                      (transaction.sellerEmail || 'Not available') : 
                      (transaction.buyerEmail || 'Not available')}
                  </span>
                </div>
                <button className="text-bharose-primary text-sm">Email</button>
              </div>
            </div>
          </div>
          
          <div className="bg-bharose-light rounded-lg p-3 mt-4 flex items-start">
            <ShieldCheck className="text-bharose-primary mr-2 mt-0.5" size={18} />
            <p className="text-sm">
              Funds are being held securely in escrow until delivery is confirmed
            </p>
          </div>
        </div>
        
        <div className="bharose-card mb-6">
          <h3 className="font-medium mb-4">Transaction Status</h3>
          <StatusTimeline currentStatus={transaction.status} />
        </div>

        {/* Enhanced Action Buttons based on status and role */}
        <div className="space-y-4">
          {/* Buyer Actions */}
          {isBuyer && currentStatus === 'contract_sent' && (
            <button 
              className="bharose-primary-button w-full"
              onClick={handleContractAccept}
            >
              Accept Contract
            </button>
          )}

          {isBuyer && currentStatus === 'contract_accepted' && (
            <button 
              className="bharose-primary-button w-full"
              onClick={handlePaymentMade}
            >
              <CreditCard size={18} className="mr-2" />
              Confirm Payment Made
            </button>
          )}

          {isBuyer && currentStatus === 'delivered' && (
            <button 
              className="bharose-primary-button w-full"
              onClick={() => setShowDeliveryConfirmation(true)}
            >
              <FileCheck size={18} className="mr-2" />
              Confirm Delivery Received
            </button>
          )}

          {/* Seller Actions */}
          {isSeller && currentStatus === 'payment_made' && (
            <button 
              className="bharose-primary-button w-full"
              onClick={() => setShowDeliveryUpload(true)}
            >
              <Upload size={18} className="mr-2" />
              Upload Delivery Proof
            </button>
          )}

          {/* Common Actions */}
          {transaction.status === 'in-progress' && (
            <button 
              className="bharose-outline-button w-full"
              onClick={handleRaiseDispute}
            >
              <Flag size={18} className="mr-2" />
              Raise a Dispute
            </button>
          )}
        </div>
        
        <button 
          className="bharose-outline-button w-full mt-4"
          onClick={handleHomeNavigation}
        >
          <Home size={18} className="mr-2" />
          Go to Dashboard
        </button>
        
        <button 
          className="w-full p-3 flex justify-center items-center text-muted-foreground hover:text-bharose-primary mt-4"
          onClick={() => setShowSupportChat(true)}
        >
          <MessageSquare size={18} className="mr-2" />
          Contact Support
        </button>
      </motion.div>
      
      {/* Delivery Proof Upload Modal */}
      {showDeliveryUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-semibold">Upload Delivery Proof</h3>
              <button 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowDeliveryUpload(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <DeliveryProofUpload
                transactionId={id!}
                onUploadComplete={handleDeliveryUploadComplete}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Delivery Confirmation Modal */}
      {showDeliveryConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-semibold">Confirm Delivery</h3>
              <button 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowDeliveryConfirmation(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <DeliveryConfirmation
                transactionId={id!}
                onConfirmDelivery={handleDeliveryConfirmed}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Support Chat */}
      {showSupportChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white rounded-xl w-full max-w-md max-h-[80vh] flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-semibold">Support Chat</h3>
              <button 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowSupportChat(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {transaction.status === 'disputed' && (
                <div className="bg-bharose-error/10 p-3 rounded-lg mb-4">
                  <p className="text-sm font-medium text-bharose-error">
                    Dispute Details: {transaction.disputeDetails || 'No details provided'}
                  </p>
                </div>
              )}
              
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare size={40} className="mx-auto mb-2 opacity-20" />
                  <p>Start a conversation with our support team</p>
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === 'user' 
                          ? 'bg-bharose-primary text-white' 
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bharose-primary/30"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  className="bg-bharose-primary text-white rounded-full w-10 h-10 flex items-center justify-center"
                  onClick={handleSendMessage}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {showCompleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white rounded-xl p-6 w-full max-w-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-center mb-4">
              <CheckCircle size={40} className="text-bharose-success mx-auto mb-2" />
              <h3 className="text-xl font-semibold">Complete Transaction?</h3>
              <p className="text-muted-foreground mt-2">
                This will release the payment to the seller and mark the transaction as complete.
              </p>
            </div>
            
            <div className="space-y-3 mt-6">
              <button 
                className="bharose-primary-button w-full"
                onClick={handleComplete}
              >
                Yes, Complete Transaction
              </button>
              
              <button 
                className="bharose-outline-button w-full"
                onClick={() => setShowCompleteConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;
