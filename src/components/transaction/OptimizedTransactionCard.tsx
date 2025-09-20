import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  CheckCheck, 
  BadgeAlert,
  User,
  Package2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction, TransactionStatus } from '@/utils/transactionState';
import { useToast } from '@/hooks/use-toast';

interface OptimizedTransactionCardProps {
  transaction: Transaction;
  userMode: string;
  onTransactionClick: (id: string) => void;
  onStatusUpdate: (id: string, status: TransactionStatus, disputeDetails?: string) => void;
  onDisputeOpen: (id: string) => void;
}

const OptimizedTransactionCard = memo<OptimizedTransactionCardProps>(({
  transaction,
  userMode,
  onTransactionClick,
  onStatusUpdate,
  onDisputeOpen
}) => {
  const { toast } = useToast();

  const getStatusColor = (status: TransactionStatus) => {
    switch(status) {
      case 'in-progress':
        return 'bg-bharose-primary/10 text-bharose-primary border-bharose-primary/20';
      case 'completed':
        return 'bg-bharose-success/10 text-bharose-success border-bharose-success/20';
      case 'disputed':
        return 'bg-bharose-error/10 text-bharose-error border-bharose-error/20';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch(status) {
      case 'in-progress':
        return <Clock size={14} />;
      case 'completed':
        return <CheckCheck size={14} />;
      case 'disputed':
        return <BadgeAlert size={14} />;
      default:
        return null;
    }
  };

  const shouldShowActions = () => {
    return userMode === 'Buyer' && 
           transaction.role === 'buyer' && 
           transaction.status === 'in-progress';
  };

  const handleConfirmDeal = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStatusUpdate(transaction.id, 'completed');
    toast({
      title: "Deal Confirmed",
      description: "Transaction completed successfully",
    });
  };

  const handleRaiseDispute = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDisputeOpen(transaction.id);
  };

  return (
    <motion.div
      className="bharose-card cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      onClick={() => onTransactionClick(transaction.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{transaction.title}</h3>
          <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
            {transaction.role === 'buyer' ? (
              <Package2 size={12} />
            ) : (
              <User size={12} />
            )}
            <span className="truncate">
              {transaction.role === 'buyer' ? 'Buying from' : 'Selling to'} {transaction.counterparty}
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-3">
          <p className="font-semibold text-sm">₹{transaction.amount.toLocaleString()}</p>
          <div className="flex items-center justify-end mt-1">
            <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${getStatusColor(transaction.status)}`}>
              {getStatusIcon(transaction.status)}
              <span className="capitalize">{transaction.status}</span>
            </span>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mb-3">
        {transaction.date}
      </div>
      
      {shouldShowActions() && (
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 h-8 text-xs bg-bharose-success/5 text-bharose-success border-bharose-success/30 hover:bg-bharose-success/10"
            onClick={handleConfirmDeal}
          >
            <CheckCircle2 size={12} className="mr-1" /> 
            Confirm
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 h-8 text-xs bg-bharose-error/5 text-bharose-error border-bharose-error/30 hover:bg-bharose-error/10"
            onClick={handleRaiseDispute}
          >
            <AlertCircle size={12} className="mr-1" /> 
            Dispute
          </Button>
        </div>
      )}
    </motion.div>
  );
});

OptimizedTransactionCard.displayName = 'OptimizedTransactionCard';

export default OptimizedTransactionCard;