export interface SecurityScore {
  overall: number;
  factors: {
    phoneVerified: boolean;
    emailVerified: boolean;
    documentVerified: boolean;
    bankVerified: boolean;
    biometricEnabled: boolean;
    transactionHistory: number;
    disputeHistory: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface VerificationDocument {
  type: 'aadhaar' | 'pan' | 'passport' | 'driving_license';
  number: string;
  image: File;
  status: 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface BiometricData {
  type: 'fingerprint' | 'face' | 'voice';
  template: string;
  enrolledAt: string;
  lastUsed?: string;
}

export class SecurityService {
  private static readonly API_BASE = '/api/security';

  // Multi-Factor Authentication
  static async enableMFA(userId: string, method: 'sms' | 'email' | 'authenticator'): Promise<{ success: boolean; qrCode?: string; backupCodes?: string[] }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      qrCode: method === 'authenticator' ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' : undefined,
      backupCodes: method === 'authenticator' ? ['ABC123', 'DEF456', 'GHI789'] : undefined
    };
  }

  static async verifyMFA(userId: string, code: string, method: 'sms' | 'email' | 'authenticator'): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple verification logic for demo
    if (code.length === 6 && /^\d+$/.test(code)) {
      return { success: true };
    }
    
    return { success: false, error: 'Invalid verification code' };
  }

  // Document Verification using OCR
  static async verifyDocument(document: VerificationDocument): Promise<{ success: boolean; extractedData?: any; confidence?: number }> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate OCR extraction
    const extractedData = {
      name: 'John Doe',
      number: document.number,
      dateOfBirth: '1990-01-01',
      address: '123 Main Street, City, State',
      issuedDate: '2020-01-01',
      expiryDate: '2030-01-01'
    };
    
    return {
      success: true,
      extractedData,
      confidence: 0.95
    };
  }

  // Bank Account Verification
  static async verifyBankAccount(accountNumber: string, ifscCode: string, holderName: string): Promise<{ success: boolean; verified: boolean; holderName?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate penny drop verification
    return {
      success: true,
      verified: true,
      holderName: holderName
    };
  }

  // Biometric Enrollment
  static async enrollBiometric(userId: string, biometricData: BiometricData): Promise<{ success: boolean; templateId?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      templateId: `bio_${Date.now()}`
    };
  }

  // Risk Assessment
  static async calculateSecurityScore(userId: string): Promise<SecurityScore> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data - in real app, this would come from user's actual data
    const factors = {
      phoneVerified: true,
      emailVerified: true,
      documentVerified: Math.random() > 0.3,
      bankVerified: Math.random() > 0.4,
      biometricEnabled: Math.random() > 0.6,
      transactionHistory: Math.floor(Math.random() * 50),
      disputeHistory: Math.floor(Math.random() * 3)
    };
    
    let score = 0;
    if (factors.phoneVerified) score += 15;
    if (factors.emailVerified) score += 10;
    if (factors.documentVerified) score += 25;
    if (factors.bankVerified) score += 20;
    if (factors.biometricEnabled) score += 15;
    if (factors.transactionHistory > 10) score += 10;
    if (factors.disputeHistory === 0) score += 5;
    
    const riskLevel = score >= 80 ? 'low' : score >= 50 ? 'medium' : 'high';
    
    const recommendations = [];
    if (!factors.documentVerified) recommendations.push('Complete document verification for higher trust score');
    if (!factors.bankVerified) recommendations.push('Verify bank account for secure payments');
    if (!factors.biometricEnabled) recommendations.push('Enable biometric authentication for enhanced security');
    if (factors.transactionHistory < 5) recommendations.push('Complete more transactions to build trust history');
    
    return {
      overall: score,
      factors,
      riskLevel,
      recommendations
    };
  }

  // Fraud Detection
  static async detectFraud(transactionData: any): Promise<{ riskScore: number; flags: string[]; recommendation: 'approve' | 'review' | 'reject' }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const flags = [];
    let riskScore = 0;
    
    // Check transaction amount
    if (transactionData.amount > 100000) {
      flags.push('High value transaction');
      riskScore += 30;
    }
    
    // Check user history
    if (transactionData.userTransactionCount < 3) {
      flags.push('New user with limited history');
      riskScore += 20;
    }
    
    // Check velocity
    if (transactionData.recentTransactionCount > 10) {
      flags.push('High transaction velocity');
      riskScore += 25;
    }
    
    // Check location
    if (transactionData.locationChange) {
      flags.push('Location anomaly detected');
      riskScore += 15;
    }
    
    const recommendation = riskScore > 70 ? 'reject' : riskScore > 40 ? 'review' : 'approve';
    
    return {
      riskScore,
      flags,
      recommendation
    };
  }

  // Real-time Monitoring
  static async monitorTransaction(transactionId: string): Promise<{ status: string; alerts: string[] }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const alerts = [];
    const random = Math.random();
    
    if (random > 0.9) {
      alerts.push('Unusual payment method detected');
    }
    if (random > 0.95) {
      alerts.push('Multiple devices accessing account');
    }
    
    return {
      status: 'monitoring',
      alerts
    };
  }

  // Session Security
  static async validateSession(sessionToken: string): Promise<{ valid: boolean; userId?: string; expiresAt?: string }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simple session validation
    if (sessionToken && sessionToken.length > 10) {
      return {
        valid: true,
        userId: 'user_123',
        expiresAt: new Date(Date.now() + 3600000).toISOString()
      };
    }
    
    return { valid: false };
  }

  // Secure Communication
  static async encryptSensitiveData(data: string): Promise<string> {
    // Simple base64 encoding for demo - in production use proper encryption
    return btoa(data);
  }

  static async decryptSensitiveData(encryptedData: string): Promise<string> {
    try {
      return atob(encryptedData);
    } catch {
      throw new Error('Failed to decrypt data');
    }
  }
}