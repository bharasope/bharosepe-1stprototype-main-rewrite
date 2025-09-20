
import React from 'react';
import { User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface TestProfile {
  id: string;
  name: string;
  role: 'Seller' | 'Buyer';
  phone: string;
  email: string;
  avatar?: string;
}

interface ProfileManagerProps {
  currentProfile: TestProfile;
  profiles: TestProfile[];
  onProfileSwitch: (profile: TestProfile) => void;
  className?: string;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({
  currentProfile,
  profiles,
  onProfileSwitch,
  className = ''
}) => {
  const [showProfileList, setShowProfileList] = React.useState(false);

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setShowProfileList(!showProfileList)}
        className="flex items-center gap-2 min-w-[120px]"
      >
        <User size={16} />
        <span className="text-sm">{currentProfile.name}</span>
        <Badge variant="secondary" className="text-xs">
          {currentProfile.role}
        </Badge>
        <ChevronDown size={14} />
      </Button>

      {showProfileList && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <h3 className="font-medium text-sm">Switch Test Profile</h3>
            <p className="text-xs text-muted-foreground">Only 2 test users available</p>
          </div>
          <div className="p-2 space-y-1">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => {
                  onProfileSwitch(profile);
                  setShowProfileList(false);
                }}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  currentProfile.id === profile.id
                    ? 'bg-bharose-primary/10 border border-bharose-primary/20'
                    : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-bharose-primary/20 rounded-full flex items-center justify-center">
                    <User size={14} className="text-bharose-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{profile.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {profile.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{profile.phone}</p>
                  </div>
                  {currentProfile.id === profile.id && (
                    <div className="w-2 h-2 bg-bharose-primary rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManager;
