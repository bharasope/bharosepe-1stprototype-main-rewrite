import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Shield, Package, IndianRupee } from 'lucide-react';
import { TransactionType } from '@/pages/TransactionSetup';

interface TransactionDetailsProps {
  transactionType: TransactionType | null;
  details: any;
  onDetailsUpdate: (details: any) => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transactionType,
  details,
  onDetailsUpdate
}) => {
  const [formData, setFormData] = useState(details);

  useEffect(() => {
    onDetailsUpdate(formData);
  }, [formData, onDetailsUpdate]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  if (transactionType === 'goods') {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input
            type="text"
            value={formData.productName || ''}
            onChange={(e) => handleChange('productName', e.target.value)}
            placeholder="e.g. iPhone 13 Pro"
            className="bharose-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Specifications</label>
          <textarea
            value={formData.specifications || ''}
            onChange={(e) => handleChange('specifications', e.target.value)}
            placeholder="Model, color, size, condition etc."
            className="bharose-input min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              value={formData.quantity || ''}
              onChange={(e) => handleChange('quantity', e.target.value)}
              placeholder="1"
              min="1"
              className="bharose-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price (Rs.)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="50000"
                min="1"
                className="bharose-input pl-10"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Delivery Date
          </label>
          <input
            type="date"
            value={formData.deliveryDate || ''}
            onChange={(e) => handleChange('deliveryDate', e.target.value)}
            className="bharose-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <Package className="inline h-4 w-4 mr-1" />
            Return/Exchange Policy
          </label>
          <select
            value={formData.returnPolicy || ''}
            onChange={(e) => handleChange('returnPolicy', e.target.value)}
            className="bharose-input"
          >
            <option value="">Select policy</option>
            <option value="no-return">No Return/Exchange</option>
            <option value="7-days">7 Days Return</option>
            <option value="15-days">15 Days Return</option>
            <option value="30-days">30 Days Return</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <Shield className="inline h-4 w-4 mr-1" />
            Warranty Period
          </label>
          <select
            value={formData.warranty || ''}
            onChange={(e) => handleChange('warranty', e.target.value)}
            className="bharose-input"
          >
            <option value="">No Warranty</option>
            <option value="3-months">3 Months</option>
            <option value="6-months">6 Months</option>
            <option value="1-year">1 Year</option>
            <option value="2-years">2 Years</option>
          </select>
        </div>
      </div>
    );
  }

  if (transactionType === 'services') {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Service Description</label>
          <textarea
            value={formData.serviceDescription || ''}
            onChange={(e) => handleChange('serviceDescription', e.target.value)}
            placeholder="Detailed description of the service to be provided"
            className="bharose-input min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price (Rs.)</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              value={formData.price || ''}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="5000"
              min="1"
              className="bharose-input pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Completion Date
          </label>
          <input
            type="date"
            value={formData.completionDate || ''}
            onChange={(e) => handleChange('completionDate', e.target.value)}
            className="bharose-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Service Location
          </label>
          <select
            value={formData.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="bharose-input"
          >
            <option value="">Select location</option>
            <option value="remote">Remote/Online</option>
            <option value="client-location">At Client's Location</option>
            <option value="provider-location">At Service Provider's Location</option>
            <option value="custom">Custom Location</option>
          </select>
        </div>

        {formData.location === 'custom' && (
          <div>
            <label className="block text-sm font-medium mb-2">Custom Location</label>
            <input
              type="text"
              value={formData.customLocation || ''}
              onChange={(e) => handleChange('customLocation', e.target.value)}
              placeholder="Enter address or location details"
              className="bharose-input"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Service Policy</label>
          <textarea
            value={formData.servicePolicy || ''}
            onChange={(e) => handleChange('servicePolicy', e.target.value)}
            placeholder="Revisions allowed, refund policy, cancellation terms etc."
            className="bharose-input min-h-[80px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Deliverables</label>
          <textarea
            value={formData.deliverables || ''}
            onChange={(e) => handleChange('deliverables', e.target.value)}
            placeholder="What will be delivered (files, reports, completed work etc.)"
            className="bharose-input min-h-[80px]"
          />
        </div>
      </div>
    );
  }

  return null;
};

export default TransactionDetails;
