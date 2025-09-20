
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import UserRoleToggle from './UserRoleToggle';
import { useUserModeContext } from './UserModeContext';
import { Badge } from '@/components/ui/badge';

interface HeaderWithRoleToggleProps {
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  notificationCount?: number;
  className?: string;
  showUserToggle?: boolean;
}

const HeaderWithRoleToggle: React.FC<HeaderWithRoleToggleProps> = ({
  title,
  showBack = false,
  showNotifications = false,
  notificationCount = 0,
  className = '',
  showUserToggle = true
}) => {
  const navigate = useNavigate();
  const { userMode, setUserMode } = useUserModeContext();

  return (
    <div className={`flex items-center justify-between py-4 ${className}`}>
      <div className="flex items-center">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        {title && <h1 className="text-xl font-semibold">{title}</h1>}
      </div>
      
      <div className="flex items-center space-x-2">
        {showUserToggle && (
          <UserRoleToggle 
            currentMode={userMode} 
            onChange={setUserMode} 
          />
        )}
        
        {showNotifications && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/notifications')}
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>
        )}
        
        <ThemeToggle />
      </div>
    </div>
  );
};

export default HeaderWithRoleToggle;
