
import React from 'react';
import { ShoppingBag, CreditCard } from 'lucide-react';
import { TransactionRole } from '@/pages/TransactionSetup';

interface RoleSelectionProps {
  selectedRole: TransactionRole | null;
  onRoleSelect: (role: TransactionRole) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({
  selectedRole,
  onRoleSelect
}) => {
  const roles = [
    {
      id: 'buyer' as TransactionRole,
      title: 'I am Buying',
      description: 'I will make payment for goods/services',
      icon: CreditCard,
      color: 'text-blue-600'
    },
    {
      id: 'seller' as TransactionRole,
      title: 'I am Selling',
      description: 'I will provide goods/services',
      icon: ShoppingBag,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-medium">Choose Your Role</h3>
      <div className="grid grid-cols-1 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <div
              key={role.id}
              onClick={() => onRoleSelect(role.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedRole === role.id
                  ? 'border-bharose-primary bg-bharose-primary/5'
                  : 'border-border hover:border-bharose-primary/50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mr-3`}>
                  <Icon className={`h-6 w-6 ${role.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{role.title}</h4>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
                {selectedRole === role.id && (
                  <div className="w-5 h-5 bg-bharose-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
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

export default RoleSelection;
