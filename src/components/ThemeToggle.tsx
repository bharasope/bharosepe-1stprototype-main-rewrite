
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { setTheme } = useTheme();
  
  // Always set to light theme and hide the toggle button
  React.useEffect(() => {
    setTheme('light');
  }, [setTheme]);
  
  return null; // Don't render the toggle button
};

export default ThemeToggle;
