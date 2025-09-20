
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface UserStats {
  successRate: number;
}

interface ProfilePerformanceMetricsProps {
  userStats: UserStats;
}

const ProfilePerformanceMetrics: React.FC<ProfilePerformanceMetricsProps> = ({ userStats }) => {
  return (
    <div className="bharose-card">
      <h3 className="font-medium mb-4">Performance Metrics</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Transaction Completion</span>
          <span className="font-medium">{userStats.successRate.toFixed(1)}%</span>
        </div>
        <Progress value={userStats.successRate} className="h-2" />
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Response Rate</span>
          <span className="font-medium">94%</span>
        </div>
        <Progress value={94} className="h-2" />
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Average Response Time</span>
          <Badge variant="outline">Within 2 hours</Badge>
        </div>
      </div>
    </div>
  );
};

export default ProfilePerformanceMetrics;
