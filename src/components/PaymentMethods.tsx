import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  lastFour?: string;
}

interface PaymentMethodsProps {
  methods: PaymentMethod[];
  selectedMethod: string;
  onSelect: (id: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  methods,
  selectedMethod,
  onSelect,
}) => {
  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <motion.div
          key={method.id}
          className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer ${
            selectedMethod === method.id
              ? 'border-bharose-primary bg-bharose-primary/5'
              : 'border-border'
          }`}
          onClick={() => onSelect(method.id)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center mr-3">
              <img
                src={method.icon}
                alt={method.name}
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <p className="font-medium">{method.name}</p>
              {method.lastFour && (
                <p className="text-xs text-muted-foreground">
                  •••• {method.lastFour}
                </p>
              )}
            </div>
          </div>
          {selectedMethod === method.id && (
            <CheckCircle className="h-5 w-5 text-bharose-primary" />
          )}
        </motion.div>
      ))}
      
      <Button
        variant="outline"
        className="w-full mt-2 border-dashed"
        onClick={() => {}}
      >
        + Add Payment Method
      </Button>
    </div>
  );
};

export default PaymentMethods;
