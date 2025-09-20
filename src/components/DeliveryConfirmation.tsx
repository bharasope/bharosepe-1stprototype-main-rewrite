
import React, { useState } from 'react';
import { CheckCircle, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEnhancedTransactionStore } from '@/utils/enhancedTransactionState';
import { toast } from 'sonner';

interface DeliveryConfirmationProps {
  transactionId: string;
  onConfirmDelivery: () => void;
}

const DeliveryConfirmation: React.FC<DeliveryConfirmationProps> = ({
  transactionId,
  onConfirmDelivery
}) => {
  const [feedback, setFeedback] = useState('');
  const [confirming, setConfirming] = useState(false);
  const { getDeliveryProofs } = useEnhancedTransactionStore();
  
  const deliveryProofs = getDeliveryProofs(transactionId);

  const handleConfirmDelivery = async () => {
    setConfirming(true);
    
    try {
      // Simulate confirmation process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Delivery confirmed! Funds will be released to the seller.');
      onConfirmDelivery();
    } catch (error) {
      toast.error('Failed to confirm delivery');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bharose-card">
        <h3 className="font-medium mb-4">Confirm Delivery</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The seller has marked this order as delivered. Please review the delivery proof and confirm receipt.
        </p>

        {deliveryProofs.length > 0 && (
          <div className="space-y-3 mb-4">
            <h4 className="font-medium text-sm">Delivery Proof:</h4>
            {deliveryProofs.map((proof) => (
              <div key={proof.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <div>
                    <p className="text-sm font-medium">{proof.fileName}</p>
                    {proof.description && (
                      <p className="text-xs text-muted-foreground">{proof.description}</p>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Eye size={14} className="mr-1" />
                  View
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Feedback (Optional)</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience with this transaction..."
              className="w-full p-3 border border-border rounded-lg resize-none"
              rows={3}
            />
          </div>

          <div className="bg-bharose-light rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-bharose-primary mt-0.5" size={20} />
              <div>
                <p className="font-medium text-sm">Ready to confirm?</p>
                <p className="text-sm text-muted-foreground">
                  By confirming delivery, you authorize the release of ₹{/* amount will be passed */} to the seller. 
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleConfirmDelivery}
            disabled={confirming}
            className="w-full bg-bharose-success hover:bg-bharose-success/90"
          >
            {confirming ? 'Processing...' : 'Confirm Delivery & Release Funds'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryConfirmation;
