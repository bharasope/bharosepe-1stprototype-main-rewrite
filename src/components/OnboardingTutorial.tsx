
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, ShieldCheck, MessageSquare, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
}

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: OnboardingStep[] = [
    {
      title: "Welcome to Bharose Pe",
      description: "Bharose Pe provides a secure escrow service to help buyers and sellers transact with confidence.",
      icon: <ShieldCheck className="h-12 w-12 text-bharose-primary" />,
      image: "https://source.unsplash.com/random/600x400/?handshake"
    },
    {
      title: "Create Secure Transactions",
      description: "Browse listings or create your own. When you find something you like, initiate a secure escrow transaction.",
      icon: <CreditCard className="h-12 w-12 text-bharose-primary" />,
      image: "https://source.unsplash.com/random/600x400/?payment"
    },
    {
      title: "Chat with Confidence",
      description: "Use our integrated chat system to communicate with the other party without sharing personal contact details.",
      icon: <MessageSquare className="h-12 w-12 text-bharose-primary" />,
      image: "https://source.unsplash.com/random/600x400/?chat"
    },
    {
      title: "You're All Set!",
      description: "Start using Bharose Pe to make secure transactions. Your money is only released when you're satisfied with the deal.",
      icon: <CheckCircle className="h-12 w-12 text-bharose-success" />,
      image: "https://source.unsplash.com/random/600x400/?success"
    }
  ];
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = () => {
    onComplete();
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-card border shadow-lg rounded-xl w-full max-w-md mx-4 overflow-hidden"
          >
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 z-10" 
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
              
              {steps[currentStep].image && (
                <div className="relative h-48 w-full bg-muted">
                  <img 
                    src={steps[currentStep].image} 
                    alt={steps[currentStep].title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex justify-center mb-6">
                {steps[currentStep].icon}
              </div>
              
              <h2 className="text-xl font-semibold text-center mb-2">
                {steps[currentStep].title}
              </h2>
              
              <p className="text-center text-muted-foreground mb-6">
                {steps[currentStep].description}
              </p>
              
              <div className="mb-6">
                <Progress value={(currentStep + 1) / steps.length * 100} className="h-1" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Step {currentStep + 1} of {steps.length}</span>
                  <span>{Math.round((currentStep + 1) / steps.length * 100)}% Complete</span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                
                <Button onClick={nextStep}>
                  {currentStep === steps.length - 1 ? (
                    <>Get Started</>
                  ) : (
                    <>Next <ArrowRight className="h-4 w-4 ml-2" /></>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTutorial;
