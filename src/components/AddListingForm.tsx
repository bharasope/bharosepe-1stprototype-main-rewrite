
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package2, Briefcase, X } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { useTransactionStore } from '@/utils/transactionState';

interface AddListingFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddListingForm: React.FC<AddListingFormProps> = ({ onClose, onSuccess }) => {
  const { addListing } = useTransactionStore();
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'product' as 'product' | 'service',
    price: '',
    terms: '',
    description: '',
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Only allow numbers
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Please enter a listing title');
      return;
    }
    
    if (!formData.price || parseInt(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    
    if (!formData.terms) {
      toast.error('Please enter terms for the listing');
      return;
    }
    
    setLoading(true);
    
    // Add the new listing to our store - we use dummy sellerId and sellerPhone
    // In a real app this would come from the authenticated user
    addListing({
      title: formData.title,
      type: formData.type,
      price: Number(formData.price),
      terms: formData.terms,
      sellerPhone: '9999990001', // This would be the current user's phone
      sellerId: 'SELLER001',     // This would be the current user's ID
      description: formData.description,
      image: `https://source.unsplash.com/random/300x200/?${formData.type === 'product' ? 'product' : 'service'}`
    });
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Listing created successfully!');
      onSuccess();
    }, 1000);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Listing</h2>
          <button 
            className="p-1 rounded-full hover:bg-muted"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bharose-input"
              placeholder="e.g. Graphic Design Services"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <div className="grid grid-cols-2 gap-3">
              <div 
                className={`p-3 rounded-lg border-2 cursor-pointer ${
                  formData.type === 'product'
                    ? 'border-bharose-primary bg-bharose-light'
                    : 'border-border'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'product' }))}
              >
                <div className="flex items-center">
                  <Package2 className="text-bharose-primary mr-2" size={18} />
                  <span className="font-medium">Product</span>
                </div>
              </div>
              <div 
                className={`p-3 rounded-lg border-2 cursor-pointer ${
                  formData.type === 'service'
                    ? 'border-bharose-primary bg-bharose-light'
                    : 'border-border'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'service' }))}
              >
                <div className="flex items-center">
                  <Briefcase className="text-bharose-primary mr-2" size={18} />
                  <span className="font-medium">Service</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="bharose-input pl-8"
                placeholder="0"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Terms</label>
            <input
              type="text"
              name="terms"
              value={formData.terms}
              onChange={handleChange}
              className="bharose-input"
              placeholder="e.g. 3-day delivery, 1 revision"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bharose-input min-h-[100px]"
              placeholder="Describe your product or service in detail"
            />
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
                Creating...
              </span>
            ) : (
              'Create Listing'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddListingForm;
