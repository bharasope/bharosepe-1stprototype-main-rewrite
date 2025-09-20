
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Upload, Camera, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const KycVerification = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    address: '',
    panNumber: '',
    aadharNumber: '',
    documentType: 'aadhar',
    documentFront: null as File | null,
    documentBack: null as File | null,
    selfie: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    
    // Simulate KYC submission
    setTimeout(() => {
      setLoading(false);
      toast.success('KYC verification submitted successfully!');
      navigate('/profile-setup');
    }, 2000);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <User className="mx-auto h-12 w-12 text-bharose-primary mb-3" />
        <h2 className="bharose-heading text-xl">Personal Information</h2>
        <p className="bharose-subheading">Please provide your basic details</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="bharose-input"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="bharose-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="bharose-input min-h-[80px]"
            placeholder="Enter your complete address"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <FileText className="mx-auto h-12 w-12 text-bharose-primary mb-3" />
        <h2 className="bharose-heading text-xl">Identity Verification</h2>
        <p className="bharose-subheading">Provide your identity documents</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleInputChange}
            className="bharose-input"
            placeholder="Enter your PAN number"
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
          <input
            type="text"
            name="aadharNumber"
            value={formData.aadharNumber}
            onChange={handleInputChange}
            className="bharose-input"
            placeholder="Enter your Aadhar number"
            maxLength={12}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
          <select
            name="documentType"
            value={formData.documentType}
            onChange={handleInputChange}
            className="bharose-input"
          >
            <option value="aadhar">Aadhar Card</option>
            <option value="passport">Passport</option>
            <option value="driving_license">Driving License</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Camera className="mx-auto h-12 w-12 text-bharose-primary mb-3" />
        <h2 className="bharose-heading text-xl">Document Upload</h2>
        <p className="bharose-subheading">Upload your documents and selfie</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Document Front</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Click to upload document front</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('documentFront', e.target.files?.[0] || null)}
              className="hidden"
              id="documentFront"
            />
            <label htmlFor="documentFront" className="cursor-pointer">
              <Button variant="outline" className="mt-2" asChild>
                <span>Choose File</span>
              </Button>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Document Back</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Click to upload document back</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('documentBack', e.target.files?.[0] || null)}
              className="hidden"
              id="documentBack"
            />
            <label htmlFor="documentBack" className="cursor-pointer">
              <Button variant="outline" className="mt-2" asChild>
                <span>Choose File</span>
              </Button>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Selfie</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Take a selfie or upload photo</p>
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e) => handleFileUpload('selfie', e.target.files?.[0] || null)}
              className="hidden"
              id="selfie"
            />
            <label htmlFor="selfie" className="cursor-pointer">
              <Button variant="outline" className="mt-2" asChild>
                <span>Take Selfie</span>
              </Button>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bharose-container">
      <div className="flex-1 flex flex-col justify-center items-center px-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? 'bg-bharose-primary text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-12 h-1 ${
                        step < currentStep ? 'bg-bharose-primary' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 space-x-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                className="flex-1 bharose-primary-button"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1 bharose-primary-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </span>
                ) : (
                  'Submit KYC'
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KycVerification;
