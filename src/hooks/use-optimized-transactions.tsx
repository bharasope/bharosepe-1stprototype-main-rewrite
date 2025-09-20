import { useMemo, useCallback, useState } from 'react';
import { useTransactionStore, Transaction, TransactionStatus } from '@/utils/transactionState';

interface FilterOptions {
  status: TransactionStatus | 'all';
  dateRange: { from: Date | undefined; to: Date | undefined };
  amountRange: [number, number];
  sortBy: 'newest' | 'oldest' | 'amount-high' | 'amount-low';
  searchTerm: string;
}

export const useOptimizedTransactions = (userMode: string) => {
  const { transactions, updateTransactionStatus, addTransaction } = useTransactionStore();
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    dateRange: { from: undefined, to: undefined },
    amountRange: [0, 100000],
    sortBy: 'newest',
    searchTerm: '',
  });

  // Memoized filtered and sorted transactions
  const processedTransactions = useMemo(() => {
    let filtered = transactions.filter(tx => 
      userMode === 'Buyer' ? tx.role === 'buyer' : tx.role === 'seller'
    );

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(tx => tx.status === filters.status);
    }

    // Apply amount range filter
    filtered = filtered.filter(tx => 
      tx.amount >= filters.amountRange[0] && tx.amount <= filters.amountRange[1]
    );

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.title.toLowerCase().includes(searchLower) ||
        tx.counterparty.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        return [...filtered].reverse();
      case 'oldest':
        return filtered;
      case 'amount-high':
        return [...filtered].sort((a, b) => b.amount - a.amount);
      case 'amount-low':
        return [...filtered].sort((a, b) => a.amount - b.amount);
      default:
        return filtered;
    }
  }, [transactions, userMode, filters]);

  // Memoized transaction counts by status
  const transactionCounts = useMemo(() => {
    const userTransactions = transactions.filter(tx => 
      userMode === 'Buyer' ? tx.role === 'buyer' : tx.role === 'seller'
    );
    
    return {
      all: userTransactions.length,
      'in-progress': userTransactions.filter(tx => tx.status === 'in-progress').length,
      completed: userTransactions.filter(tx => tx.status === 'completed').length,
      disputed: userTransactions.filter(tx => tx.status === 'disputed').length,
    };
  }, [transactions, userMode]);

  // Optimized filter update function
  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Optimistic transaction update
  const optimisticUpdateStatus = useCallback((
    id: string, 
    status: TransactionStatus, 
    disputeDetails?: string, 
    hasEvidence?: boolean
  ) => {
    updateTransactionStatus(id, status, disputeDetails, hasEvidence);
  }, [updateTransactionStatus]);

  // Quick transaction creation
  const quickCreateTransaction = useCallback((data: Partial<Transaction>) => {
    return addTransaction({
      title: data.title || '',
      amount: data.amount || 0,
      status: data.status || 'in-progress',
      role: data.role || (userMode === 'Buyer' ? 'buyer' : 'seller'),
      counterparty: data.counterparty || '',
      sellerPhone: data.sellerPhone || '',
      description: data.description || ''
    });
  }, [addTransaction, userMode]);

  return {
    transactions: processedTransactions,
    transactionCounts,
    filters,
    updateFilters,
    optimisticUpdateStatus,
    quickCreateTransaction,
    totalTransactions: transactions.length,
  };
};