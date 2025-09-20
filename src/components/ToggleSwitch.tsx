
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  options: [string, string];
  onChange: (selectedOption: string) => void;
  defaultOption?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  options, 
  onChange,
  defaultOption 
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(defaultOption || options[0]);

  const handleToggle = (option: string) => {
    setSelectedOption(option);
    onChange(option);
  };

  return (
    <div className="toggle-switch">
      <motion.div 
        className="toggle-switch-thumb"
        animate={{ 
          x: selectedOption === options[0] ? 0 : '100%'
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      <div className="relative flex w-full h-full">
        <button
          className={`toggle-label ${selectedOption === options[0] ? 'text-bharose-primary' : 'text-muted-foreground'}`}
          onClick={() => handleToggle(options[0])}
        >
          {options[0]}
        </button>
        <button
          className={`toggle-label ${selectedOption === options[1] ? 'text-bharose-primary' : 'text-muted-foreground'}`}
          onClick={() => handleToggle(options[1])}
        >
          {options[1]}
        </button>
      </div>
    </div>
  );
};

export default ToggleSwitch;
