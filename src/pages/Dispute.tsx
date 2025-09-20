
import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { AlertCircle, Upload, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useProfileManager } from '@/hooks/use-profile-manager';

const Dispute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { currentProfile } = useProfileManager();
  
  // Get transaction ID from URL params or location state
  const transactionId = id || location.state?.transactionId || 'unknown';
  
  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
    hasProofImages: false
  });
  const [loading, setLoading] = useState(false);

  // Role-specific issue types
  const buyerIssueTypes = [
    { id: 'item-not-received', label: 'Item not received (after payment made)' },
    { id: 'item-damaged', label: 'Item received damaged/defective' },
    { id: 'item-not-as-described', label: 'Item not as described in listing' },
    { id: 'item-counterfeit', label: 'Item is counterfeit/fake' },
    { id: 'seller-not-responding', label: 'Seller not responding to messages' },
    { id: 'delivery-delayed', label: 'Delivery delayed beyond agreed time' },
    { id: 'wrong-item', label: 'Wrong item delivered' },
    { id: 'additional-payment-request', label: 'Seller requesting additional payment' },
    { id: 'quality-issues', label: 'Quality issues with product/service' },
    { id: 'other-buyer', label: 'Other buyer-specific issues' }
  ];

  const sellerIssueTypes = [
    { id: 'payment-not-received', label: 'Payment not received despite delivery' },
    { id: 'buyer-not-responding', label: 'Buyer not responding after delivery' },
    { id: 'invalid-refund-request', label: 'Buyer requesting refund without valid reason' },
    { id: 'additional-demands', label: 'Buyer demanding additional services not agreed upon' },
    { id: 'abusive-buyer', label: 'Buyer being abusive/threatening' },
    { id: 'buyer-unavailable', label: 'Buyer not available for delivery' },
    { id: 'wrong-address', label: 'Buyer provided wrong delivery address' },
    { id: 'false-claims', label: 'False claims about product condition' },
    { id: 'return-after-usage', label: 'Buyer trying to return after usage period' },
    { id: 'other-seller', label: 'Other seller-specific issues' }
  ];

  const issueTypes = currentProfile.role === 'Buyer' ? buyerIssueTypes : sellerIssueTypes;
  const isBuyer = currentProfile.role === 'Buyer';

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.issueType) {
      toast.error('Please select an issue type');
      return;
    }
    
    if (!formData.description || formData.description.length < 10) {
      toast.error('Please provide a detailed description of the issue');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Dispute submitted successfully!');
      
      // Navigate back to transaction status
      navigate(`/transaction-status/${transactionId}`);
    }, 1500);
  };

  return (
    <div className="bharose-container pb-8">
      <Header title="Raise a Dispute" showBack />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4"
      >
        <div className="bharose-card bg-bharose-error/10 mb-6 flex items-start">
          <AlertCircle className="text-bharose-error mr-2 mt-0.5 flex-shrink-0" size={18} />
          <div>
            <h3 className="font-medium text-bharose-error">Before raising a dispute</h3>
            <p className="text-sm mt-1">
              {isBuyer 
                ? "Please try to contact the seller directly first. Disputes should be raised only if the seller is unresponsive or unable to resolve the issue."
                : "Please try to resolve the issue directly with the buyer first. Disputes should be raised only if direct communication fails."
              }
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Issue Type ({currentProfile.role} Perspective)
            </label>
            <div className="space-y-3">
              {issueTypes.map((issue) => (
                <div 
                  key={issue.id}
                  className={`p-3 rounded-lg border ${
                    formData.issueType === issue.id
                      ? 'border-bharose-primary bg-bharose-light'
                      : 'border-border'
                  } flex justify-between items-center cursor-pointer`}
                  onClick={() => setFormData(prev => ({ ...prev, issueType: issue.id }))}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                      formData.issueType === issue.id
                        ? 'bg-bharose-primary'
                        : 'border border-muted-foreground'
                    }`}>
                      {formData.issueType === issue.id && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span>{issue.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Describe the Issue
              <span className="text-bharose-error ml-1">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bharose-input min-h-[150px]"
              placeholder={isBuyer 
                ? "Provide detailed information about the issue you're facing as a buyer (e.g., what was expected vs what was received, timeline of events, etc.)..."
                : "Provide detailed information about the issue you're facing as a seller (e.g., buyer behavior, payment issues, delivery problems, etc.)..."
              }
              required
            />
          </div>
          
          <div className="bharose-card p-5 border-dashed flex flex-col items-center justify-center">
            <Upload size={24} className="text-muted-foreground mb-2" />
            <p className="font-medium">Upload Evidence</p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              {isBuyer 
                ? "Add photos of the received item, screenshots of conversations, or payment receipts"
                : "Add delivery photos, payment confirmations, or screenshots of buyer communication"
              }
            </p>
            <label className="bharose-primary-button mt-4 cursor-pointer">
              <span>Choose Files</span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                multiple 
                onChange={() => setFormData(prev => ({ ...prev, hasProofImages: true }))}
              />
            </label>
            {formData.hasProofImages && (
              <p className="text-sm text-bharose-success mt-2">
                Files selected successfully
              </p>
            )}
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
                Submitting...
              </span>
            ) : (
              'Submit Dispute'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Dispute;
