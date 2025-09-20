import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import OptimizedTransactionCard from './OptimizedTransactionCard';
import { useOptimizedTransactions } from '@/hooks/use-optimized-transactions';
import { TransactionStatus } from '@/utils/transactionState';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface OptimizedTransactionListProps {
  userMode: string;
}

const OptimizedTransactionList: React.FC<OptimizedTransactionListProps> = ({ userMode }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    transactions,
    transactionCounts,
    filters,
    updateFilters,
    optimisticUpdateStatus
  } = useOptimizedTransactions(userMode);

  const [activeTab, setActiveTab] = useState<string>('all');
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
  const [disputeDetails, setDisputeDetails] = useState('');

  // Filter transactions by active tab
  const displayTransactions = useMemo(() => {
    if (activeTab === 'all') return transactions;
    return transactions.filter(tx => tx.status === activeTab);
  }, [transactions, activeTab]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ searchTerm: e.target.value });
  }, [updateFilters]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    updateFilters({ status: tab as TransactionStatus | 'all' });
  }, [updateFilters]);

  const handleTransactionClick = useCallback((id: string) => {
    navigate(`/transaction-status/${id}`, { state: { userMode } });
  }, [navigate, userMode]);

  const handleDisputeOpen = useCallback((id: string) => {
    setCurrentTransactionId(id);
    setDisputeDialogOpen(true);
  }, []);

  const handleDisputeSubmit = useCallback(() => {
    if (!disputeDetails.trim()) {
      toast({
        title: "Error",
        description: "Please describe the issue",
        variant: "destructive",
      });
      return;
    }

    if (currentTransactionId) {
      optimisticUpdateStatus(currentTransactionId, 'disputed', disputeDetails, true);
      setDisputeDialogOpen(false);
      setDisputeDetails('');
      
      toast({
        title: "Dispute Submitted",
        description: "Your dispute has been submitted successfully",
      });
    }
  }, [currentTransactionId, disputeDetails, optimisticUpdateStatus, toast]);

  const handleSortToggle = useCallback(() => {
    const newSort = filters.sortBy === 'newest' ? 'oldest' : 'newest';
    updateFilters({ sortBy: newSort });
  }, [filters.sortBy, updateFilters]);

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="pl-9 h-9"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSortToggle}
          className="h-9 px-3"
        >
          <SortAsc size={16} />
        </Button>
      </div>

      {/* Active Filters */}
      {(filters.searchTerm || filters.sortBy !== 'newest') && (
        <div className="flex gap-2 flex-wrap">
          {filters.searchTerm && (
            <Badge variant="outline" className="text-xs">
              Search: {filters.searchTerm}
              <button
                onClick={() => updateFilters({ searchTerm: '' })}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.sortBy !== 'newest' && (
            <Badge variant="outline" className="text-xs">
              Sort: {filters.sortBy}
            </Badge>
          )}
        </div>
      )}

      {/* Transaction Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="all" className="text-xs">
            All {transactionCounts.all > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 text-xs px-1">
                {transactionCounts.all}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="text-xs">
            Active {transactionCounts['in-progress'] > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 text-xs px-1">
                {transactionCounts['in-progress']}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs">
            Done {transactionCounts.completed > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 text-xs px-1">
                {transactionCounts.completed}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="disputed" className="text-xs">
            Issues {transactionCounts.disputed > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 text-xs px-1">
                {transactionCounts.disputed}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {displayTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No transactions found</p>
            </div>
          ) : (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {displayTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <OptimizedTransactionCard
                    transaction={transaction}
                    userMode={userMode}
                    onTransactionClick={handleTransactionClick}
                    onStatusUpdate={optimisticUpdateStatus}
                    onDisputeOpen={handleDisputeOpen}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dispute Dialog */}
      <Dialog open={disputeDialogOpen} onOpenChange={setDisputeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Raise a Dispute</DialogTitle>
            <DialogDescription>
              Please provide details about the issue you're experiencing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea 
              value={disputeDetails}
              onChange={(e) => setDisputeDetails(e.target.value)}
              placeholder="Describe your issue in detail..."
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDisputeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDisputeSubmit}
              className="bg-bharose-primary hover:bg-bharose-primary/90"
            >
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OptimizedTransactionList;