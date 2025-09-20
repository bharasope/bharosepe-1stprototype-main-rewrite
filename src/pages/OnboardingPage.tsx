
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import OnboardingTutorial from '@/components/OnboardingTutorial';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(true);
  
  const handleCompleteTutorial = () => {
    // Store in local storage that the tutorial has been completed
    localStorage.setItem('onboarding_completed', 'true');
    toast.success("Welcome to Bharose Pe!", {
      description: "You're all set up and ready to go"
    });
    navigate('/dashboard');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center space-y-6"
      >
        <h1 className="text-3xl font-bold">Welcome to Bharose Pe</h1>
        <p className="text-muted-foreground">
          Secure transactions made simple
        </p>
        
        <div className="space-y-3 pt-4">
          <Button 
            onClick={() => setShowTutorial(true)}
            className="w-full"
          >
            Start Tutorial
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="w-full"
          >
            Skip to Dashboard
          </Button>
        </div>
      </motion.div>
      
      <OnboardingTutorial 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)} 
        onComplete={handleCompleteTutorial} 
      />
    </div>
  );
};

export default OnboardingPage;
