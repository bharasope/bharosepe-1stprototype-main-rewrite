
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ProfileHeaderProps {
  formData: {
    name: string;
    phone: string;
    email: string;
  };
  currentProfile: {
    role: string;
  };
  profileCompleteness: number;
  isEditing: boolean;
  getInitials: (name: string) => string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  formData,
  currentProfile,
  profileCompleteness,
  isEditing,
  getInitials
}) => {
  return (
    <div className="bharose-card mb-6 flex flex-col items-center py-6">
      <Avatar className="h-24 w-24 mb-4">
        <AvatarImage src="https://source.unsplash.com/random/200x200/?portrait" alt="Profile" />
        <AvatarFallback>{getInitials(formData.name)}</AvatarFallback>
      </Avatar>
      
      <h2 className="text-xl font-semibold">{formData.name}</h2>
      <p className="text-muted-foreground">{formData.phone}</p>
      <p className="text-muted-foreground text-sm">{formData.email}</p>
      <p className="text-xs text-bharose-primary mt-1">{currentProfile.role}</p>
      
      {/* Profile Completeness */}
      <div className="w-full max-w-xs mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Profile Completeness</span>
          <span className="font-medium">{profileCompleteness}%</span>
        </div>
        <Progress value={profileCompleteness} className="h-2" />
      </div>
      
      {/* Verification Status */}
      <div className="flex items-center gap-2 mt-3">
        <Badge variant="outline" className="text-green-600 border-green-200">
          <CheckCircle2 size={12} className="mr-1" />
          Phone Verified
        </Badge>
        <Badge variant="outline" className="text-green-600 border-green-200">
          <CheckCircle2 size={12} className="mr-1" />
          Email Verified
        </Badge>
      </div>
      
      {isEditing && (
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
        >
          Change Photo
        </Button>
      )}
    </div>
  );
};

export default ProfileHeader;
