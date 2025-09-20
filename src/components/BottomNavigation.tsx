
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Package2, User, Bell, ShoppingBag } from 'lucide-react';
import { useUserModeContext } from './UserModeContext';

type BottomNavigationProps = {
  userMode?: string;
};

const BottomNavigation: React.FC<BottomNavigationProps> = ({ userMode: propUserMode }) => {
  const location = useLocation();
  const { userMode } = useUserModeContext();
  
  // Use context value if available, otherwise fall back to prop
  const currentMode = userMode || propUserMode || 'Buyer';
  
  // Define navigation items based on user mode
  const navItems = currentMode === 'Buyer' ? [
    { path: '/dashboard', label: 'Home', icon: <Home size={20} /> },
    { path: '/transactions', label: 'Transactions', icon: <Package2 size={20} /> },
    { path: '/notifications', label: 'Alerts', icon: <Bell size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ] : [
    { path: '/dashboard', label: 'Home', icon: <Home size={20} /> },
    { path: '/transactions', label: 'Deals', icon: <Package2 size={20} /> },
    { path: '/listings', label: 'My Listings', icon: <ShoppingBag size={20} /> },
    { path: '/notifications', label: 'Alerts', icon: <Bell size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-40">
      <div className="max-w-md mx-auto flex items-center justify-between px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            state={{ userMode: currentMode }}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-3 ${
                isActive ? 'text-bharose-primary' : 'text-muted-foreground'
              }`
            }
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
