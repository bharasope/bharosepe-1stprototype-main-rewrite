export interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'netbanking' | 'wallet' | 'crypto' | 'emi';
  provider: string;
  displayName: string;
  isDefault: boolean;
  isActive: boolean;
  metadata: {
    maskedNumber?: string;
    expiryDate?: string;
    bankName?: string;
    walletProvider?: string;
    cryptoAddress?: string;
    upiId?: string;
  };
  fees: {
    percentage: number;
    fixed: number;
    minimum: number;
    maximum: number;
  };
  limits: {
    minimum: number;
    maximum: number;
    daily: number;
    monthly: number;
  };
}

export interface PaymentGateway {
  id: string;
  name: string;
  displayName: string;
  isActive: boolean;
  supportedMethods: PaymentMethod['type'][];
  processingTime: string;
  settlementTime: string;
  successRate: number;
  features: string[];
  countries: string[];
  currencies: string[];
}

export interface EMIOption {
  tenure: number; // months
  interestRate: number;
  emiAmount: number;
  totalAmount: number;
  processingFee: number;
  provider: string;
  eligibleAmount: { min: number; max: number };
}

export interface CryptoPayment {
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC';
  address: string;
  amount: number;
  usdValue: number;
  exchangeRate: number;
  networkFee: number;
  confirmationsRequired: number;
  estimatedTime: string;
}

export interface PaymentRequest {
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethodId: string;
  gatewayId: string;
  description: string;
  metadata?: Record<string, any>;
  returnUrl?: string;
  webhookUrl?: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';
  gatewayResponse: any;
  redirectUrl?: string;
  qrCode?: string;
  instructions?: string[];
  estimatedCompletionTime?: string;
}

export class PaymentService {
  private static readonly API_BASE = '/api/payments';
  private static readonly GATEWAYS: PaymentGateway[] = [
    {
      id: 'razorpay',
      name: 'razorpay',
      displayName: 'Razorpay',
      isActive: true,
      supportedMethods: ['upi', 'card', 'netbanking', 'wallet'],
      processingTime: 'Instant',
      settlementTime: 'T+1',
      successRate: 0.96,
      features: ['Auto-recurring', 'International payments', 'Smart routing'],
      countries: ['IN'],
      currencies: ['INR', 'USD']
    },
    {
      id: 'payu',
      name: 'payu',
      displayName: 'PayU',
      isActive: true,
      supportedMethods: ['upi', 'card', 'netbanking', 'wallet', 'emi'],
      processingTime: 'Instant',
      settlementTime: 'T+1',
      successRate: 0.94,
      features: ['EMI options', 'Instant refunds', 'Risk management'],
      countries: ['IN'],
      currencies: ['INR']
    },
    {
      id: 'stripe',
      name: 'stripe',
      displayName: 'Stripe',
      isActive: true,
      supportedMethods: ['card'],
      processingTime: 'Instant',
      settlementTime: 'T+2',
      successRate: 0.97,
      features: ['Global payments', 'Subscription billing', 'Advanced fraud protection'],
      countries: ['US', 'EU', 'AU', 'SG'],
      currencies: ['USD', 'EUR', 'GBP', 'SGD']
    },
    {
      id: 'coinbase',
      name: 'coinbase',
      displayName: 'Coinbase Commerce',
      isActive: false, // Disabled by default
      supportedMethods: ['crypto'],
      processingTime: '10-60 mins',
      settlementTime: 'T+1',
      successRate: 0.99,
      features: ['Multiple cryptocurrencies', 'No chargebacks', 'Global reach'],
      countries: ['Global'],
      currencies: ['BTC', 'ETH', 'USDT', 'USDC']
    }
  ];

  // Get Available Payment Methods
  static async getPaymentMethods(amount: number, currency: string = 'INR'): Promise<PaymentMethod[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const methods: PaymentMethod[] = [
      {
        id: 'upi_1',
        type: 'upi',
        provider: 'razorpay',
        displayName: 'UPI',
        isDefault: true,
        isActive: true,
        metadata: { upiId: 'user@paytm' },
        fees: { percentage: 0, fixed: 0, minimum: 0, maximum: 0 },
        limits: { minimum: 1, maximum: 100000, daily: 100000, monthly: 1000000 }
      },
      {
        id: 'card_1',
        type: 'card',
        provider: 'razorpay',
        displayName: 'Credit/Debit Card',
        isDefault: false,
        isActive: true,
        metadata: { maskedNumber: '**** **** **** 1234', expiryDate: '12/25' },
        fees: { percentage: 2.0, fixed: 0, minimum: 0, maximum: 5000 },
        limits: { minimum: 100, maximum: 500000, daily: 500000, monthly: 2000000 }
      },
      {
        id: 'netbanking_1',
        type: 'netbanking',
        provider: 'payu',
        displayName: 'Net Banking',
        isDefault: false,
        isActive: true,
        metadata: { bankName: 'HDFC Bank' },
        fees: { percentage: 1.0, fixed: 0, minimum: 0, maximum: 2500 },
        limits: { minimum: 100, maximum: 1000000, daily: 1000000, monthly: 5000000 }
      },
      {
        id: 'wallet_1',
        type: 'wallet',
        provider: 'payu',
        displayName: 'Digital Wallet',
        isDefault: false,
        isActive: true,
        metadata: { walletProvider: 'Paytm' },
        fees: { percentage: 0.5, fixed: 0, minimum: 0, maximum: 1000 },
        limits: { minimum: 10, maximum: 50000, daily: 50000, monthly: 200000 }
      }
    ];

    // Add EMI options for amounts > 5000
    if (amount > 5000) {
      methods.push({
        id: 'emi_1',
        type: 'emi',
        provider: 'payu',
        displayName: 'EMI (Easy Installments)',
        isDefault: false,
        isActive: true,
        metadata: {},
        fees: { percentage: 0, fixed: 0, minimum: 0, maximum: 0 },
        limits: { minimum: 5000, maximum: 500000, daily: 500000, monthly: 2000000 }
      });
    }

    return methods.filter(method => 
      amount >= method.limits.minimum && 
      amount <= method.limits.maximum
    );
  }

  // Get Available Gateways
  static async getPaymentGateways(): Promise<PaymentGateway[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.GATEWAYS.filter(gateway => gateway.isActive);
  }

  // Get EMI Options
  static async getEMIOptions(amount: number): Promise<EMIOption[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (amount < 5000) return [];
    
    const options: EMIOption[] = [];
    const tenures = [3, 6, 9, 12, 18, 24];
    
    tenures.forEach(tenure => {
      const interestRate = 12 + (tenure / 12) * 2; // 12% base + 2% per year
      const monthlyRate = interestRate / 12 / 100;
      const emiAmount = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                       (Math.pow(1 + monthlyRate, tenure) - 1);
      const totalAmount = emiAmount * tenure;
      const processingFee = Math.min(amount * 0.01, 1000); // 1% or max ₹1000
      
      options.push({
        tenure,
        interestRate,
        emiAmount: Math.round(emiAmount),
        totalAmount: Math.round(totalAmount),
        processingFee: Math.round(processingFee),
        provider: 'Bajaj Finserv',
        eligibleAmount: { min: 5000, max: 500000 }
      });
    });
    
    return options;
  }

  // Initialize Payment
  static async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate different payment method flows
    const method = await this.getPaymentMethodById(request.paymentMethodId);
    
    if (method?.type === 'upi') {
      return {
        paymentId,
        status: 'pending',
        gatewayResponse: { gateway_payment_id: `${request.gatewayId}_${paymentId}` },
        qrCode: `upi://pay?pa=merchant@upi&pn=Bharose%20Pe&am=${request.amount}&cu=INR&tn=${request.description}`,
        instructions: [
          'Scan the QR code with any UPI app',
          'Or use the UPI ID: merchant@bharose.upi',
          'Payment will be processed automatically'
        ],
        estimatedCompletionTime: '2-5 minutes'
      };
    }
    
    if (method?.type === 'card') {
      return {
        paymentId,
        status: 'processing',
        gatewayResponse: { gateway_payment_id: `${request.gatewayId}_${paymentId}` },
        redirectUrl: `https://checkout.${request.gatewayId}.com/payment/${paymentId}`,
        estimatedCompletionTime: 'Instant'
      };
    }
    
    return {
      paymentId,
      status: 'pending',
      gatewayResponse: { gateway_payment_id: `${request.gatewayId}_${paymentId}` },
      redirectUrl: `https://checkout.${request.gatewayId}.com/payment/${paymentId}`,
      estimatedCompletionTime: '5-10 minutes'
    };
  }

  // Check Payment Status
  static async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate payment status progression
    const random = Math.random();
    const status = random > 0.8 ? 'success' : random > 0.6 ? 'processing' : 'pending';
    
    return {
      paymentId,
      status,
      gatewayResponse: { 
        gateway_payment_id: `gateway_${paymentId}`,
        gateway_status: status,
        gateway_message: status === 'success' ? 'Payment completed successfully' : 'Payment in progress'
      }
    };
  }

  // Process Refund
  static async processRefund(paymentId: string, amount: number, reason: string): Promise<{
    refundId: string;
    status: 'initiated' | 'processed' | 'failed';
    estimatedTime: string;
    refundAmount: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      refundId: `rfnd_${Date.now()}`,
      status: 'initiated',
      estimatedTime: '3-5 business days',
      refundAmount: amount
    };
  }

  // Cryptocurrency Payments
  static async getCryptoPaymentDetails(amount: number, currency: 'BTC' | 'ETH' | 'USDT' | 'USDC'): Promise<CryptoPayment> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const exchangeRates = {
      BTC: 4500000, // ₹45,00,000 per BTC
      ETH: 250000,  // ₹2,50,000 per ETH
      USDT: 83,     // ₹83 per USDT
      USDC: 83      // ₹83 per USDC
    };
    
    const networkFees = {
      BTC: 0.0001,
      ETH: 0.002,
      USDT: 1,
      USDC: 1
    };
    
    const rate = exchangeRates[currency];
    const cryptoAmount = amount / rate;
    const networkFee = networkFees[currency];
    
    return {
      currency,
      address: `${currency.toLowerCase()}_${Math.random().toString(36).substr(2, 34)}`,
      amount: cryptoAmount,
      usdValue: amount / 83, // Convert INR to USD
      exchangeRate: rate,
      networkFee,
      confirmationsRequired: currency === 'BTC' ? 3 : currency === 'ETH' ? 12 : 6,
      estimatedTime: currency === 'BTC' ? '30-60 minutes' : currency === 'ETH' ? '2-5 minutes' : '1-3 minutes'
    };
  }

  // International Payments
  static async getInternationalPaymentOptions(amount: number, fromCurrency: string, toCurrency: string): Promise<{
    exchangeRate: number;
    convertedAmount: number;
    fees: { percentage: number; fixed: number; total: number };
    estimatedTime: string;
    providers: { name: string; fee: number; rate: number; time: string }[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock exchange rates
    const rates: Record<string, number> = {
      'INR_USD': 0.012,
      'USD_INR': 83.0,
      'INR_EUR': 0.011,
      'EUR_INR': 90.0,
      'INR_GBP': 0.0095,
      'GBP_INR': 105.0
    };
    
    const rateKey = `${fromCurrency}_${toCurrency}`;
    const exchangeRate = rates[rateKey] || 1;
    const convertedAmount = amount * exchangeRate;
    const feePercentage = 2.5;
    const fixedFee = fromCurrency === 'INR' ? 50 : 2;
    const totalFee = (amount * feePercentage / 100) + fixedFee;
    
    return {
      exchangeRate,
      convertedAmount,
      fees: {
        percentage: feePercentage,
        fixed: fixedFee,
        total: totalFee
      },
      estimatedTime: '1-3 business days',
      providers: [
        { name: 'Wise', fee: totalFee * 0.8, rate: exchangeRate * 1.002, time: '1-2 days' },
        { name: 'Remitly', fee: totalFee * 0.9, rate: exchangeRate * 1.001, time: '1-3 days' },
        { name: 'Western Union', fee: totalFee * 1.2, rate: exchangeRate * 0.998, time: '2-3 days' }
      ]
    };
  }

  // Payment Analytics
  static async getPaymentAnalytics(period: '24h' | '7d' | '30d' = '30d'): Promise<{
    totalVolume: number;
    totalTransactions: number;
    successRate: number;
    averageAmount: number;
    methodDistribution: { method: string; volume: number; count: number; percentage: number }[];
    gatewayPerformance: { gateway: string; volume: number; successRate: number; avgResponseTime: number }[];
    failureReasons: { reason: string; count: number; percentage: number }[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const baseVolume = period === '24h' ? 500000 : period === '7d' ? 3500000 : 15000000;
    const baseTransactions = period === '24h' ? 150 : period === '7d' ? 1050 : 4500;
    
    return {
      totalVolume: baseVolume,
      totalTransactions: baseTransactions,
      successRate: 0.94 + Math.random() * 0.04,
      averageAmount: baseVolume / baseTransactions,
      methodDistribution: [
        { method: 'UPI', volume: baseVolume * 0.45, count: Math.floor(baseTransactions * 0.50), percentage: 45 },
        { method: 'Cards', volume: baseVolume * 0.35, count: Math.floor(baseTransactions * 0.25), percentage: 35 },
        { method: 'Net Banking', volume: baseVolume * 0.15, count: Math.floor(baseTransactions * 0.15), percentage: 15 },
        { method: 'Wallets', volume: baseVolume * 0.05, count: Math.floor(baseTransactions * 0.10), percentage: 5 }
      ],
      gatewayPerformance: [
        { gateway: 'Razorpay', volume: baseVolume * 0.6, successRate: 0.96, avgResponseTime: 1.2 },
        { gateway: 'PayU', volume: baseVolume * 0.3, successRate: 0.94, avgResponseTime: 1.5 },
        { gateway: 'Stripe', volume: baseVolume * 0.1, successRate: 0.97, avgResponseTime: 0.8 }
      ],
      failureReasons: [
        { reason: 'Insufficient Balance', count: Math.floor(baseTransactions * 0.03), percentage: 35 },
        { reason: 'Technical Error', count: Math.floor(baseTransactions * 0.02), percentage: 25 },
        { reason: 'Bank Declined', count: Math.floor(baseTransactions * 0.015), percentage: 20 },
        { reason: 'User Cancelled', count: Math.floor(baseTransactions * 0.012), percentage: 15 },
        { reason: 'Others', count: Math.floor(baseTransactions * 0.005), percentage: 5 }
      ]
    };
  }

  // Helper Methods
  private static async getPaymentMethodById(id: string): Promise<PaymentMethod | null> {
    const methods = await this.getPaymentMethods(100000);
    return methods.find(method => method.id === id) || null;
  }

  // Webhook Handling
  static async handleWebhook(gatewayId: string, payload: any): Promise<{ processed: boolean; action?: string }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Process webhook based on gateway
    console.log(`Processing webhook from ${gatewayId}:`, payload);
    
    return {
      processed: true,
      action: 'payment_status_updated'
    };
  }
}