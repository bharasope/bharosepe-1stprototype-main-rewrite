
import React from 'react';
import { CheckCheck } from 'lucide-react';

// This component serves as a replacement for the missing CheckCircle
// We use CheckCheck from lucide-react as an alternative
const UICheckCircle: React.FC<{ className?: string; size?: number }> = ({ 
  className = "", 
  size = 16 
}) => {
  return <CheckCheck className={className} size={size} />;
};

export default UICheckCircle;
