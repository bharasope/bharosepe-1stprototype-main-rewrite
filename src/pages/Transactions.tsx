
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';
import { useLocation, useNavigate } from 'react-router-dom';
import OptimizedTransactionList from '@/components/transaction/OptimizedTransactionList';
import QuickTransactionSetup from '@/components/transaction/QuickTransactionSetup';

interface TransactionsProps {
  userMode?: string;
}

const Transactions: React.FC<TransactionsProps> = ({ userMode: propUserMode = 'Buyer' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the user mode from location state if available, otherwise use the prop
  const [userMode, setUserMode] = useState(
    location.state?.userMode || propUserMode
  );
  
  const [showQuickSetup, setShowQuickSetup] = useState(false);

  return (
    <div className="bharose-container pb-20">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between py-4">
          <h1 className="text-xl font-semibold">Transactions</h1>
          <Button
            size="sm"
            onClick={() => setShowQuickSetup(!showQuickSetup)}
            className="bharose-primary-button"
          >
            <Plus size={16} className="mr-1" />
            New
          </Button>
        </div>

        {/* Quick Transaction Setup */}
        {showQuickSetup && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <QuickTransactionSetup />
          </motion.div>
        )}
        
        {/* Optimized Transaction List */}
        <OptimizedTransactionList userMode={userMode} />
      </motion.div>
      
      <BottomNavigation userMode={userMode} />
    </div>
  );
};

export default Transactions;
