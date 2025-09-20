
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ProfileActivityInfo: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Transaction Categories */}
      <div className="bharose-card">
        <h3 className="font-medium mb-4">Transaction Categories</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Electronics</span>
            <Badge variant="secondary">65%</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Services</span>
            <Badge variant="secondary">25%</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Others</span>
            <Badge variant="secondary">10%</Badge>
          </div>
        </div>
      </div>

      {/* Communication Stats */}
      <div className="bharose-card">
        <h3 className="font-medium mb-4">Communication</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Preferred Contact Method</span>
            <Badge variant="outline">
              <MessageCircle size={12} className="mr-1" />
              In-app Chat
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Response Time</span>
            <Badge variant="outline">Within 2 hours</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Languages</span>
            <Badge variant="outline">Hindi, English</Badge>
          </div>
        </div>
      </div>

      {/* Membership Info */}
      <div className="bharose-card">
        <h3 className="font-medium mb-4">Membership</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Member since</span>
            <span className="text-sm font-medium">March 2024</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Profile views this month</span>
            <span className="text-sm font-medium">24</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Last active</span>
            <span className="text-sm font-medium">2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileActivityInfo;
