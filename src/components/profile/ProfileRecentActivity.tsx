
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: string;
}

interface UserStats {
  recentTransactions: Transaction[];
}

interface ProfileRecentActivityProps {
  userStats: UserStats;
}

const ProfileRecentActivity: React.FC<ProfileRecentActivityProps> = ({ userStats }) => {
  return (
    <div className="bharose-card">
      <h3 className="font-medium mb-4">Recent Transactions</h3>
      {userStats.recentTransactions.length > 0 ? (
        <div className="space-y-3">
          {userStats.recentTransactions.map((tx) => (
            <div key={tx.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <div>
                <div className="font-medium text-sm">{tx.title}</div>
                <div className="text-xs text-muted-foreground">{tx.date}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">₹{tx.amount.toLocaleString()}</div>
                <Badge 
                  variant={tx.status === 'completed' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No recent transactions</p>
      )}
    </div>
  );
};

export default ProfileRecentActivity;
