
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bell, IndianRupee, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';
import ThemeToggle from '@/components/ThemeToggle';
import { useTransactionStore } from '@/utils/transactionState';
import DashboardAnalytics from '@/components/DashboardAnalytics';
import SavedSellers from '@/components/SavedSellers';
import HeaderWithProfileToggle from '@/components/HeaderWithProfileToggle';
import { useUserModeContext } from '@/components/UserModeContext';
import { useProfileManager } from '@/hooks/use-profile-manager';
import { useEnhancedTransactionStore } from '@/utils/enhancedTransactionState';

const Dashboard = () => {
  const navigate = useNavigate();
  const { userMode, setUserMode } = useUserModeContext();
  const { currentProfile } = useProfileManager();
  const { getEscrowBalance, transactions, sellers } = useTransactionStore();
  const { getAgreementsByProfile, getNotificationsByProfile } = useEnhancedTransactionStore();
  
  // Get the current balance for the escrow based on user mode
  const escrowBalance = getEscrowBalance(userMode);
  
  // Get latest active transactions (up to 3) with correct role filtering
  const activeTransactions = transactions
    .filter(tx => {
      if (tx.status !== 'in-progress') return false;
      
      // For sellers, show transactions where they are the seller
      if (currentProfile.role === 'Seller') {
        return tx.role === 'seller';
      }
      // For buyers, show transactions where they are the buyer
      else {
        return tx.role === 'buyer';
      }
    })
    .slice(0, 3);

  // Get pending agreements for current profile
  const pendingAgreements = getAgreementsByProfile(currentProfile.id)
    .filter(agreement => 
      agreement.status === 'pending' && 
      agreement.receiverProfileId === currentProfile.id
    );

  // Get sent agreements for current profile (for sellers to see status)
  const sentAgreements = getAgreementsByProfile(currentProfile.id)
    .filter(agreement => 
      agreement.senderProfileId === currentProfile.id
    );

  // Get notifications for current profile
  const notifications = getNotificationsByProfile(currentProfile.id);
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="bharose-container pb-20">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Use HeaderWithProfileToggle but disable user toggle */}
        <HeaderWithProfileToggle 
          title="Bharose Pe"
          showBack={false}
          showNotifications={true}
          showUserToggle={false}
          showProfileToggle={true}
        />
        
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">
            Welcome {currentProfile.name} ({currentProfile.role})
          </p>
        </div>

        {/* Pending Agreements Alert */}
        {pendingAgreements.length > 0 && (
          <motion.div 
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-yellow-800">
                  {pendingAgreements.length} Pending Agreement{pendingAgreements.length > 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-yellow-700">
                  You have agreements waiting for your response
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={() => navigate('/notifications')}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Review
              </Button>
            </div>
          </motion.div>
        )}

        {/* Sent Agreements Status */}
        {sentAgreements.length > 0 && (
          <motion.div 
            className="mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.06 }}
          >
            <h3 className="font-medium mb-3">Your Sent Agreements</h3>
            <div className="space-y-3">
              {sentAgreements.slice(0, 3).map((agreement) => (
                <motion.div 
                  key={agreement.id}
                  className={`bharose-card cursor-pointer ${
                    agreement.status === 'rejected' ? 'border-red-200 bg-red-50/50' : 
                    agreement.status === 'accepted' ? 'border-green-200 bg-green-50/50' : ''
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  onClick={() => navigate(`/agreement/${agreement.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{agreement.transactionTitle}</h4>
                      <p className="text-sm text-muted-foreground">
                        To: {agreement.receiverName}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          agreement.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          agreement.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
                        </span>
                        <span className="text-sm font-medium">₹{agreement.amount.toLocaleString()}</span>
                      </div>
                      {agreement.status === 'rejected' && agreement.feedback && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs font-medium text-red-700 mb-1">Rejection Reason:</p>
                          <p className="text-xs text-red-600">{agreement.feedback}</p>
                        </div>
                      )}
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground mt-1" />
                  </div>
                </motion.div>
              ))}
              {sentAgreements.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => navigate('/notifications')}
                >
                  View all {sentAgreements.length} agreements
                </Button>
              )}
            </div>
          </motion.div>
        )}
          
        {/* Escrow Balance */}
        <motion.div 
          className="bg-gradient-to-br from-bharose-primary to-bharose-dark rounded-xl p-4 text-white mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="text-sm opacity-80">Total in Escrow</p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold mt-1">₹{escrowBalance.toLocaleString()}</h2>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/20 hover:bg-white/30 border-none text-white"
              onClick={() => navigate('/transactions')}
            >
              View All
            </Button>
          </div>
        </motion.div>
        
        {/* Quick Actions */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <Button
                variant="outline"
                className="w-full h-auto py-6 flex flex-col items-center justify-center border-2 border-dashed"
                onClick={() => navigate(currentProfile.role === 'Seller' ? '/transaction-setup' : '/initiate-transaction')}
              >
                <IndianRupee className="h-6 w-6 mb-2 text-bharose-primary" />
                <span className="text-sm font-medium">
                  {currentProfile.role === 'Seller' ? 'Create Contract' : 'New Transaction'}
                </span>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <Button
                variant="outline"
                className="w-full h-auto py-6 flex flex-col items-center justify-center border-2 border-dashed"
                onClick={() => navigate('/transactions')}
              >
                <ArrowRight className="h-6 w-6 mb-2 text-bharose-primary" />
                <span className="text-sm font-medium">View Transactions</span>
              </Button>
            </motion.div>
          </div>
          
        </div>
        
        {/* Recent Transactions */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Recent Deals</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground"
              onClick={() => navigate('/transactions')}
            >
              View All
            </Button>
          </div>
          
          {activeTransactions.length === 0 ? (
            <div className="bharose-card flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">No active transactions</p>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-3"
                onClick={() => navigate(currentProfile.role === 'Seller' ? '/transaction-setup' : '/initiate-transaction')}
              >
                {currentProfile.role === 'Seller' ? 'Create a Contract' : 'Start a New Transaction'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTransactions.map((transaction) => (
                <motion.div 
                  key={transaction.id}
                  className="bharose-card cursor-pointer flex justify-between items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  onClick={() => navigate(`/transaction-status/${transaction.id}`)}
                >
                  <div>
                    <h3 className="font-medium">{transaction.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentProfile.role === 'Seller' ? 'Selling to' : 'Buying from'} {transaction.counterparty}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-semibold">₹{transaction.amount.toLocaleString()}</p>
                    <div className="flex items-center text-xs text-bharose-primary">
                      <span>View details</span>
                      <ArrowRight size={12} className="ml-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        {/* Dashboard Analytics */}
        <DashboardAnalytics userMode={currentProfile.role} />
        
        {/* Saved Sellers - Only show for Buyer mode */}
        {currentProfile.role === 'Buyer' && (
          <div className="mt-6">
            <SavedSellers sellers={sellers} />
          </div>
        )}
      </motion.div>
      
      <BottomNavigation userMode={currentProfile.role} />
    </div>
  );
};

export default Dashboard;
