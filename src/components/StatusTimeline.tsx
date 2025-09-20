import React from 'react';
import { cn } from '@/lib/utils';
import { TransactionStatus } from '@/utils/transactionState';

interface StatusTimelineProps {
  currentStatus: TransactionStatus;
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus }) => {
  const statuses: TransactionStatus[] = ['in-progress', 'completed'];
  
  const getStatusIndex = (status: TransactionStatus) => {
    if (status === 'disputed') {
      return -1;
    }
    return statuses.indexOf(status);
  };
  
  const currentIndex = getStatusIndex(currentStatus);
  
  const statusLabels: Record<TransactionStatus, string> = {
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'disputed': 'Disputed'
  };

  if (currentStatus === 'disputed') {
    return (
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-bharose-error/30"></div>
        
        <div className="space-y-8">
          <div className="relative flex items-center">
            <div className="w-4 h-4 rounded-full z-10 bg-bharose-error"></div>
            <div className="ml-6">
              <p className="font-medium text-bharose-error">
                {statusLabels.disputed}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                This transaction is under dispute
              </p>
            </div>
          </div>
          
          {statuses.map((status, index) => (
            <div key={status} className="relative flex items-center opacity-50">
              <div className="w-4 h-4 rounded-full z-10 bg-muted-foreground/30"></div>
              <div className="ml-6">
                <p className="font-medium text-muted-foreground">
                  {statusLabels[status]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-muted-foreground/30"></div>
      
      <div className="space-y-8">
        {statuses.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;
          
          return (
            <div key={status} className="relative flex items-center">
              <div 
                className={cn(
                  "w-4 h-4 rounded-full z-10",
                  isCompleted ? "bg-bharose-primary" : "bg-muted-foreground/30"
                )}
              ></div>
              
              <div className="ml-6">
                <p 
                  className={cn(
                    "font-medium",
                    isActive ? "text-bharose-primary" : 
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {statusLabels[status]}
                </p>
                
                {isActive && (
                  <p className="text-sm text-muted-foreground mt-1">Current status</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTimeline;
