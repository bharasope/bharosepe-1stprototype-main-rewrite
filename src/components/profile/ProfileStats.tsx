
import React from 'react';

interface UserStats {
  totalTransactions: number;
  successRate: number;
  avgTransactionValue: number;
  totalAmount: number;
}

interface ProfileStatsProps {
  userStats: UserStats;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ userStats }) => {
  return (
    <div className="bharose-card">
      <h3 className="font-medium mb-4">Transaction Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-bharose-primary/5 rounded-lg">
          <div className="text-2xl font-bold text-bharose-primary">{userStats.totalTransactions}</div>
          <div className="text-sm text-muted-foreground">Total Transactions</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{userStats.successRate.toFixed(0)}%</div>
          <div className="text-sm text-muted-foreground">Success Rate</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">₹{userStats.avgTransactionValue.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Avg Transaction</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">₹{userStats.totalAmount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Volume</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
