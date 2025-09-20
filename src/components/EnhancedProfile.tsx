
import React from 'react';
import { 
  Award, 
  Check, 
  Shield, 
  Star, 
  Tag, 
  Truck, 
  UserCheck 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface EnhancedProfileProps {
  user: {
    name: string;
    rating: number;
    transactionCount: number;
    joinedDate: string;
    completionRate: number;
    responseRate: number;
    responseTime: string;
    verified: boolean;
    badges: string[];
  };
}

const EnhancedProfile: React.FC<EnhancedProfileProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Reputation</h3>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(user.rating) ? 'text-bharose-warning fill-bharose-warning' : 'text-muted-foreground'}`} 
              />
            ))}
          </div>
          <span className="text-lg font-semibold">{user.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">
            ({user.transactionCount} transactions)
          </span>
        </div>
        
        <div className="text-sm">
          <span className="text-muted-foreground">Member since:</span> {user.joinedDate}
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Performance</h3>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transaction Completion</span>
              <span className="font-semibold">{user.completionRate}%</span>
            </div>
            <Progress value={user.completionRate} className="h-2" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Response Rate</span>
              <span className="font-semibold">{user.responseRate}%</span>
            </div>
            <Progress value={user.responseRate} className="h-2" />
          </div>
          
          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground">Typical Response Time</span>
            <Badge variant="outline">{user.responseTime}</Badge>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Verification & Badges</h3>
        
        <div className="flex items-center gap-2">
          {user.verified && (
            <Badge className="bg-bharose-success/20 text-bharose-success hover:bg-bharose-success/30 border-bharose-success/30">
              <Shield className="h-3 w-3 mr-1" /> Verified
            </Badge>
          )}
          
          {user.badges.includes('trusted_seller') && (
            <Badge variant="outline" className="border-bharose-primary/30">
              <UserCheck className="h-3 w-3 mr-1" /> Trusted Seller
            </Badge>
          )}
          
          {user.badges.includes('fast_shipper') && (
            <Badge variant="outline" className="border-bharose-primary/30">
              <Truck className="h-3 w-3 mr-1" /> Fast Shipper
            </Badge>
          )}
          
          {user.badges.includes('best_deals') && (
            <Badge variant="outline" className="border-bharose-primary/30">
              <Tag className="h-3 w-3 mr-1" /> Best Deals
            </Badge>
          )}
          
          {user.badges.includes('top_rated') && (
            <Badge variant="outline" className="border-bharose-primary/30">
              <Award className="h-3 w-3 mr-1" /> Top Rated
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfile;
