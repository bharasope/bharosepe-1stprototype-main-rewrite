import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Fingerprint, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { SecurityService } from '@/services/securityService';

const SecurityDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [securityScore, setSecurityScore] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState({
    documents: false,
    bank: false,
    biometric: false
  });

  useEffect(() => {
    loadSecurityStatus();
  }, []);

  const loadSecurityStatus = async () => {
    setIsLoading(true);
    try {
      const score = await SecurityService.calculateSecurityScore('user123');
      setSecurityScore(score.overall);
      
      // Simulate existing settings
      setMfaEnabled(true);
      setBiometricEnabled(false);
      setVerificationStatus({
        documents: true,
        bank: false,
        biometric: false
      });
    } catch (error) {
      console.error('Failed to load security status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableMFA = async () => {
    setIsLoading(true);
    try {
      await SecurityService.enableMFA('user123', 'sms');
      setMfaEnabled(true);
      toast.success('MFA enabled successfully');
    } catch (error) {
      toast.error('Failed to enable MFA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricEnrollment = async () => {
    setIsLoading(true);
    try {
      const biometricData = {
        type: 'face' as const,
        template: 'mock_template_data',
        enrolledAt: new Date().toISOString()
      };
      const result = await SecurityService.enrollBiometric('user123', biometricData);
      if (result.success) {
        setBiometricEnabled(true);
        toast.success('Biometric authentication enabled');
      }
    } catch (error) {
      toast.error('Failed to enable biometric authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentVerification = async () => {
    setIsLoading(true);
    try {
      // Simulate document upload
      const mockDocument = { 
        type: 'aadhaar' as const, 
        number: '1234-5678-9012',
        image: new File([''], 'aadhar.jpg', { type: 'image/jpeg' }),
        status: 'pending' as const
      };
      const result = await SecurityService.verifyDocument(mockDocument);
      
      if (result.success) {
        setVerificationStatus(prev => ({ ...prev, documents: true }));
        toast.success('Document verification completed');
      }
    } catch (error) {
      toast.error('Document verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankVerification = async () => {
    setIsLoading(true);
    try {
      const result = await SecurityService.verifyBankAccount(
        '1234567890',
        'HDFC0000123',
        'John Doe'
      );
      
      if (result.verified) {
        setVerificationStatus(prev => ({ ...prev, bank: true }));
        toast.success('Bank account verified');
      }
    } catch (error) {
      toast.error('Bank verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSecurityScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Security Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Score
            </CardTitle>
            <CardDescription>
              Your overall security rating based on enabled features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getSecurityScoreColor(securityScore)} mb-2`}>
              {securityScore}/100
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  securityScore >= 80 ? 'bg-green-500' : 
                  securityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${securityScore}%` }}
              />
            </div>
            <Badge className={getSecurityScoreBg(securityScore)}>
              {securityScore >= 80 ? 'Excellent' : 
               securityScore >= 60 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      {/* Authentication Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Authentication & Access</CardTitle>
            <CardDescription>
              Secure your account with additional authentication methods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {mfaEnabled && <CheckCircle className="h-4 w-4 text-green-600" />}
                <Switch
                  checked={mfaEnabled}
                  onCheckedChange={mfaEnabled ? () => {} : handleEnableMFA}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Fingerprint className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Biometric Authentication</h4>
                  <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {biometricEnabled && <CheckCircle className="h-4 w-4 text-green-600" />}
                <Switch
                  checked={biometricEnabled}
                  onCheckedChange={biometricEnabled ? () => {} : handleBiometricEnrollment}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Verification Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Identity Verification</CardTitle>
            <CardDescription>
              Complete these verifications to increase your security score
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Eye className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium">Document Verification</h4>
                  <p className="text-sm text-muted-foreground">Verify your Aadhar/PAN</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {verificationStatus.documents ? (
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={handleDocumentVerification}
                    disabled={isLoading}
                  >
                    Verify
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Bank Account Verification</h4>
                  <p className="text-sm text-muted-foreground">Verify your bank details</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {verificationStatus.bank ? (
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={handleBankVerification}
                    disabled={isLoading}
                  >
                    Verify
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Security Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {!mfaEnabled && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-amber-800">Enable Two-Factor Authentication</h5>
                    <p className="text-sm text-amber-700">Add SMS or app-based 2FA for better security</p>
                  </div>
                </div>
              )}
              
              {!verificationStatus.documents && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Eye className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-800">Complete Document Verification</h5>
                    <p className="text-sm text-blue-700">Verify your identity documents to build trust</p>
                  </div>
                </div>
              )}
              
              {!verificationStatus.bank && (
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <CreditCard className="h-4 w-4 text-purple-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-purple-800">Verify Bank Account</h5>
                    <p className="text-sm text-purple-700">Link and verify your bank account for transactions</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SecurityDashboard;