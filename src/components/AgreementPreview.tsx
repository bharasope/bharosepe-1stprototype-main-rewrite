
import React from 'react';
import { FileText, Send, Eye } from 'lucide-react';
import { TransactionData } from '@/pages/TransactionSetup';
import { Button } from '@/components/ui/button';

interface AgreementPreviewProps {
  transactionData: TransactionData;
  onSendAgreement: () => void;
}

const AgreementPreview: React.FC<AgreementPreviewProps> = ({
  transactionData,
  onSendAgreement
}) => {
  const { contact, role, type, details } = transactionData;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatPrice = (price: string | number) => {
    if (!price) return 'Not specified';
    return `₹${Number(price).toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="bharose-card">
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 text-bharose-primary mr-2" />
          <h3 className="font-semibold">Digital Agreement Preview</h3>
        </div>

        <div className="space-y-4 text-sm">
          <div className="pb-4 border-b">
            <h4 className="font-medium text-bharose-primary mb-2">Transaction Parties</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">{role === 'buyer' ? 'Buyer' : 'Seller'} (You)</p>
                <p className="text-muted-foreground">Your Name</p>
                <p className="text-muted-foreground">Your Phone</p>
              </div>
              <div>
                <p className="font-medium">{role === 'buyer' ? 'Seller' : 'Buyer'}</p>
                <p className="text-muted-foreground">{contact?.name}</p>
                <p className="text-muted-foreground">{contact?.phone}</p>
              </div>
            </div>
          </div>

          <div className="pb-4 border-b">
            <h4 className="font-medium text-bharose-primary mb-2">Transaction Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium capitalize">{type}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">{formatPrice(details.price)}</span>
              </div>
              
              {type === 'goods' && (
                <>
                  <div className="flex justify-between">
                    <span>Product:</span>
                    <span className="font-medium">{details.productName || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span className="font-medium">{details.quantity || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Date:</span>
                    <span className="font-medium">{formatDate(details.deliveryDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Return Policy:</span>
                    <span className="font-medium">{details.returnPolicy || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Warranty:</span>
                    <span className="font-medium">{details.warranty || 'No warranty'}</span>
                  </div>
                </>
              )}

              {type === 'services' && (
                <>
                  <div className="flex justify-between">
                    <span>Completion Date:</span>
                    <span className="font-medium">{formatDate(details.completionDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">
                      {details.location === 'custom' ? details.customLocation : details.location || 'Not specified'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {(details.specifications || details.serviceDescription) && (
            <div className="pb-4 border-b">
              <h4 className="font-medium text-bharose-primary mb-2">Description</h4>
              <p className="text-muted-foreground">
                {details.specifications || details.serviceDescription}
              </p>
            </div>
          )}

          <div className="pb-4 border-b">
            <h4 className="font-medium text-bharose-primary mb-2">Escrow Terms</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Payment will be held in Bharose Pe escrow until transaction completion</li>
              <li>• {role === 'buyer' ? 'Seller' : 'Buyer'} will be notified once payment is made</li>
              <li>• Funds will be released after successful delivery/completion</li>
              <li>• Dispute resolution available if needed</li>
            </ul>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>By proceeding, both parties agree to the terms of this digital agreement and Bharose Pe's terms of service.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1">
          <Eye className="h-4 w-4 mr-2" />
          Preview Full Agreement
        </Button>
        <Button 
          onClick={onSendAgreement}
          className="flex-1 bg-bharose-primary hover:bg-bharose-primary/90"
        >
          <Send className="h-4 w-4 mr-2" />
          Send to {contact?.name}
        </Button>
      </div>
    </div>
  );
};

export default AgreementPreview;
