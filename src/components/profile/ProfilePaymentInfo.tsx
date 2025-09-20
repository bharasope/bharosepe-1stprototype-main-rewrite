
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface FormData {
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

interface ProfilePaymentInfoProps {
  formData: FormData;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfilePaymentInfo: React.FC<ProfilePaymentInfoProps> = ({
  formData,
  isEditing,
  handleInputChange
}) => {
  return (
    <div className="space-y-6">
      <div className="bharose-card">
        <h3 className="font-medium mb-4">Payment Details</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="accountNumber">Bank Account Number</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input
              id="ifscCode"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              name="upiId"
              value={formData.upiId}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      {/* Payment Preferences */}
      <div className="bharose-card">
        <h3 className="font-medium mb-4">Payment Preferences</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Preferred Payment Method</span>
            <Badge variant="outline">UPI</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Auto-payment for small amounts</span>
            <Badge variant="outline">Under ₹1,000</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Payment reminder frequency</span>
            <Badge variant="outline">Daily</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePaymentInfo;
