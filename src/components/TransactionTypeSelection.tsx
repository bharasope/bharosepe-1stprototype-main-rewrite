
import React from 'react';
import { Package, Briefcase } from 'lucide-react';
import { TransactionType } from '@/pages/TransactionSetup';

interface TransactionTypeSelectionProps {
  selectedType: TransactionType | null;
  onTypeSelect: (type: TransactionType) => void;
}

const TransactionTypeSelection: React.FC<TransactionTypeSelectionProps> = ({
  selectedType,
  onTypeSelect
}) => {
  const types = [
    {
      id: 'goods' as TransactionType,
      title: 'Goods',
      description: 'Physical products, items, or materials',
      icon: Package,
      examples: ['Electronics', 'Clothing', 'Books', 'Furniture']
    },
    {
      id: 'services' as TransactionType,
      title: 'Services',
      description: 'Professional services or work to be done',
      icon: Briefcase,
      examples: ['Design Work', 'Consulting', 'Repair', 'Development']
    }
  ];

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">What type of transaction is this?</p>
      
      <div className="grid grid-cols-1 gap-4">
        {types.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.id}
              onClick={() => onTypeSelect(type.id)}
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                selectedType === type.id
                  ? 'border-bharose-primary bg-bharose-primary/5'
                  : 'border-border hover:border-bharose-primary/50'
              }`}
            >
              <div className="flex items-start">
                <div className="w-12 h-12 bg-bharose-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Icon className="h-6 w-6 text-bharose-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{type.title}</h3>
                  <p className="text-muted-foreground mb-3">{type.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map((example) => (
                      <span
                        key={example}
                        className="px-2 py-1 bg-muted rounded-md text-xs"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedType === type.id && (
                  <div className="w-6 h-6 bg-bharose-primary rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionTypeSelection;
