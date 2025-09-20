
import React from 'react';
import { ShoppingBag, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface UserRoleToggleProps {
  currentMode: 'Buyer' | 'Seller';
  onChange: (mode: 'Buyer' | 'Seller') => void;
  className?: string;
}

const UserRoleToggle: React.FC<UserRoleToggleProps> = ({ 
  currentMode, 
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.button
        onClick={() => onChange('Buyer')}
        className={`relative px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
          currentMode === 'Buyer' 
            ? 'bg-bharose-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <ShoppingBag size={16} />
        <span>Buyer</span>
        {currentMode === 'Buyer' && (
          <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
            Active
          </Badge>
        )}
      </motion.button>
      
      <motion.button
        onClick={() => onChange('Seller')}
        className={`relative px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
          currentMode === 'Seller' 
            ? 'bg-bharose-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <Store size={16} />
        <span>Seller</span>
        {currentMode === 'Seller' && (
          <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
            Active
          </Badge>
        )}
      </motion.button>
    </div>
  );
};

export default UserRoleToggle;
