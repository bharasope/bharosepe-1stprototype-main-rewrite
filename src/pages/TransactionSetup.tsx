
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ContactSearch from '@/components/ContactSearch';
import TransactionTypeSelection from '@/components/TransactionTypeSelection';
import TransactionDetails from '@/components/TransactionDetails';
import AgreementPreview from '@/components/AgreementPreview';
import { useProfileManager } from '@/hooks/use-profile-manager';

export type TransactionRole = 'buyer' | 'seller';
export type TransactionType = 'goods' | 'services';

export interface ContactInfo {
  id: string;
  name: string;
  phone: string;
}

export interface TransactionData {
  contact: ContactInfo | null;
  role: TransactionRole | null;
  type: TransactionType | null;
  details: any;
}

const TransactionSetup = () => {
  const navigate = useNavigate();
  const { currentProfile } = useProfileManager();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Allow both sellers and buyers to create contracts/transactions
  const autoRole: TransactionRole = currentProfile.role === 'Seller' ? 'seller' : 'buyer';
  
  const [transactionData, setTransactionData] = useState<TransactionData>({
    contact: null,
    role: autoRole,
    type: null,
    details: {}
  });

  const steps = [
    { 
      id: 1, 
      title: currentProfile.role === 'Seller' ? 'Select Buyer' : 'Select Seller', 
      component: 'contact' 
    },
    { id: 2, title: 'Contract Type', component: 'type' },
    { id: 3, title: 'Details', component: 'details' },
    { 
      id: 4, 
      title: currentProfile.role === 'Seller' ? 'Contract Preview' : 'Transaction Preview', 
      component: 'agreement' 
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const updateTransactionData = (field: keyof TransactionData, value: any) => {
    setTransactionData(prev => ({ ...prev, [field]: value }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bharose-card">
              <h3 className="font-medium mb-2">Your Role</h3>
              <p className="text-sm text-muted-foreground">
                You are creating this {currentProfile.role === 'Seller' ? 'contract' : 'transaction'} as a <span className="font-medium text-bharose-primary">{currentProfile.role}</span>
              </p>
            </div>
            <ContactSearch
              selectedContact={transactionData.contact}
              onContactSelect={(contact) => updateTransactionData('contact', contact)}
            />
          </div>
        );
      case 2:
        return (
          <TransactionTypeSelection
            selectedType={transactionData.type}
            onTypeSelect={(type) => updateTransactionData('type', type)}
          />
        );
      case 3:
        return (
          <TransactionDetails
            transactionType={transactionData.type}
            details={transactionData.details}
            onDetailsUpdate={(details) => updateTransactionData('details', details)}
          />
        );
      case 4:
        return (
          <AgreementPreview
            transactionData={transactionData}
            onSendAgreement={() => navigate('/ai-agreement-generation', { 
              state: { transactionData } 
            })}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return transactionData.contact;
      case 2:
        return transactionData.type;
      case 3:
        return Object.keys(transactionData.details).length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="bharose-container pb-8">
      <Header 
        title={currentProfile.role === 'Seller' ? 'Create Contract' : 'Create Transaction'} 
        showBack 
        onBack={handleBack} 
      />
      
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step.id 
                ? 'bg-bharose-primary text-white' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {step.id}
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <div className={`h-1 rounded ${
                  currentStep > step.id ? 'bg-bharose-primary' : 'bg-muted'
                }`}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-2">{steps[currentStep - 1].title}</h2>
        
        {renderStepContent()}

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleBack}
            className="flex-1 py-3 border border-border rounded-lg font-medium"
          >
            Back
          </button>
          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 bharose-primary-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => navigate('/ai-agreement-generation', { 
                state: { transactionData } 
              })}
              disabled={!canProceed()}
              className="flex-1 bharose-primary-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentProfile.role === 'Seller' ? 'Send Contract' : 'Create Transaction'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionSetup;
