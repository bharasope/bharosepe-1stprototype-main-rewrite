
import React from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBack = false,
  showNotification = false,
  onBack
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center">
        {showBack && (
          <button 
            onClick={handleBack}
            className="mr-2 p-2 rounded-full hover:bg-muted"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      {showNotification && (
        <button className="p-2 rounded-full hover:bg-muted relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-bharose-secondary rounded-full"></span>
        </button>
      )}
    </div>
  );
};

export default Header;
