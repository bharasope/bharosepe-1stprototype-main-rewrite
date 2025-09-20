export interface TransactionMetrics {
  totalVolume: number;
  totalCount: number;
  successRate: number;
  averageValue: number;
  topCategories: { category: string; volume: number; count: number }[];
  hourlyDistribution: { hour: number; count: number }[];
  weeklyTrend: { date: string; volume: number; count: number }[];
  monthlyGrowth: number;
}

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  retentionRate: number;
  averageSessionTime: number;
  topUserTypes: { type: string; count: number; percentage: number }[];
  geographicDistribution: { state: string; count: number; percentage: number }[];
  deviceDistribution: { device: string; count: number; percentage: number }[];
}

export interface RevenueMetrics {
  totalRevenue: number;
  monthlyRecurring: number;
  averageTransactionFee: number;
  revenueByService: { service: string; revenue: number; percentage: number }[];
  projectedGrowth: number;
  churnRate: number;
  customerLifetimeValue: number;
}

export interface SecurityMetrics {
  totalSecurityEvents: number;
  fraudAttempts: number;
  successfulVerifications: number;
  failedLogins: number;
  suspiciousActivities: number;
  securityScoreDistribution: { score: string; count: number }[];
  topThreatTypes: { type: string; count: number; severity: 'low' | 'medium' | 'high' }[];
}

export interface PerformanceMetrics {
  averageResponseTime: number;
  uptime: number;
  errorRate: number;
  throughput: number;
  latencyDistribution: { percentile: number; latency: number }[];
  topErrorTypes: { type: string; count: number; impact: 'low' | 'medium' | 'high' }[];
}

export interface PredictiveInsights {
  transactionVolumeForecast: { date: string; predicted: number; confidence: number }[];
  userGrowthPrediction: { month: string; predicted: number; confidence: number }[];
  revenueProjection: { month: string; projected: number; confidence: number }[];
  riskAssessment: { category: string; risk: 'low' | 'medium' | 'high'; impact: number }[];
  recommendations: { type: string; priority: 'low' | 'medium' | 'high'; description: string; estimatedImpact: string }[];
}

export class AnalyticsService {
  private static readonly API_BASE = '/api/analytics';

  // Transaction Analytics
  static async getTransactionMetrics(period: '24h' | '7d' | '30d' | '90d' = '30d'): Promise<TransactionMetrics> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate realistic mock data
    const baseVolume = period === '24h' ? 500000 : period === '7d' ? 3500000 : period === '30d' ? 15000000 : 45000000;
    const baseCount = period === '24h' ? 150 : period === '7d' ? 1050 : period === '30d' ? 4500 : 13500;
    
    return {
      totalVolume: baseVolume + Math.random() * 1000000,
      totalCount: baseCount + Math.floor(Math.random() * 100),
      successRate: 0.96 + Math.random() * 0.03,
      averageValue: baseVolume / baseCount,
      topCategories: [
        { category: 'Electronics', volume: baseVolume * 0.3, count: Math.floor(baseCount * 0.25) },
        { category: 'Services', volume: baseVolume * 0.25, count: Math.floor(baseCount * 0.35) },
        { category: 'Fashion', volume: baseVolume * 0.2, count: Math.floor(baseCount * 0.2) },
        { category: 'Home & Garden', volume: baseVolume * 0.15, count: Math.floor(baseCount * 0.12) },
        { category: 'Others', volume: baseVolume * 0.1, count: Math.floor(baseCount * 0.08) }
      ],
      hourlyDistribution: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: Math.floor(Math.random() * 50) + (hour >= 10 && hour <= 20 ? 30 : 10)
      })),
      weeklyTrend: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        volume: Math.floor(Math.random() * 2000000) + 500000,
        count: Math.floor(Math.random() * 200) + 50
      })),
      monthlyGrowth: (Math.random() - 0.3) * 50 + 15 // -15% to +35% growth
    };
  }

  // User Analytics
  static async getUserMetrics(period: '24h' | '7d' | '30d' | '90d' = '30d'): Promise<UserMetrics> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const baseUsers = period === '24h' ? 1200 : period === '7d' ? 8400 : period === '30d' ? 35000 : 105000;
    
    return {
      totalUsers: baseUsers + Math.floor(Math.random() * 1000),
      activeUsers: Math.floor(baseUsers * (0.6 + Math.random() * 0.2)),
      newUsers: Math.floor(baseUsers * 0.15),
      retentionRate: 0.75 + Math.random() * 0.15,
      averageSessionTime: 12 + Math.random() * 8, // minutes
      topUserTypes: [
        { type: 'Individual Buyers', count: Math.floor(baseUsers * 0.45), percentage: 45 },
        { type: 'Individual Sellers', count: Math.floor(baseUsers * 0.35), percentage: 35 },
        { type: 'Business Buyers', count: Math.floor(baseUsers * 0.12), percentage: 12 },
        { type: 'Business Sellers', count: Math.floor(baseUsers * 0.08), percentage: 8 }
      ],
      geographicDistribution: [
        { state: 'Maharashtra', count: Math.floor(baseUsers * 0.18), percentage: 18 },
        { state: 'Karnataka', count: Math.floor(baseUsers * 0.15), percentage: 15 },
        { state: 'Delhi', count: Math.floor(baseUsers * 0.12), percentage: 12 },
        { state: 'Tamil Nadu', count: Math.floor(baseUsers * 0.11), percentage: 11 },
        { state: 'Gujarat', count: Math.floor(baseUsers * 0.10), percentage: 10 },
        { state: 'Others', count: Math.floor(baseUsers * 0.34), percentage: 34 }
      ],
      deviceDistribution: [
        { device: 'Mobile', count: Math.floor(baseUsers * 0.75), percentage: 75 },
        { device: 'Desktop', count: Math.floor(baseUsers * 0.20), percentage: 20 },
        { device: 'Tablet', count: Math.floor(baseUsers * 0.05), percentage: 5 }
      ]
    };
  }

  // Revenue Analytics
  static async getRevenueMetrics(period: '24h' | '7d' | '30d' | '90d' = '30d'): Promise<RevenueMetrics> {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const baseRevenue = period === '24h' ? 25000 : period === '7d' ? 175000 : period === '30d' ? 750000 : 2250000;
    
    return {
      totalRevenue: baseRevenue + Math.random() * 50000,
      monthlyRecurring: baseRevenue * 0.15,
      averageTransactionFee: 45 + Math.random() * 20,
      revenueByService: [
        { service: 'Escrow Fees', revenue: baseRevenue * 0.70, percentage: 70 },
        { service: 'Premium Subscriptions', revenue: baseRevenue * 0.15, percentage: 15 },
        { service: 'Verification Services', revenue: baseRevenue * 0.08, percentage: 8 },
        { service: 'Insurance', revenue: baseRevenue * 0.05, percentage: 5 },
        { service: 'Others', revenue: baseRevenue * 0.02, percentage: 2 }
      ],
      projectedGrowth: 15 + Math.random() * 20,
      churnRate: 0.05 + Math.random() * 0.03,
      customerLifetimeValue: 2500 + Math.random() * 1000
    };
  }

  // Security Analytics
  static async getSecurityMetrics(period: '24h' | '7d' | '30d' | '90d' = '30d'): Promise<SecurityMetrics> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const baseEvents = period === '24h' ? 50 : period === '7d' ? 350 : period === '30d' ? 1500 : 4500;
    
    return {
      totalSecurityEvents: baseEvents + Math.floor(Math.random() * 100),
      fraudAttempts: Math.floor(baseEvents * 0.1),
      successfulVerifications: Math.floor(baseEvents * 0.85),
      failedLogins: Math.floor(baseEvents * 0.15),
      suspiciousActivities: Math.floor(baseEvents * 0.05),
      securityScoreDistribution: [
        { score: 'High (80-100)', count: Math.floor(baseEvents * 0.6) },
        { score: 'Medium (50-79)', count: Math.floor(baseEvents * 0.3) },
        { score: 'Low (0-49)', count: Math.floor(baseEvents * 0.1) }
      ],
      topThreatTypes: [
        { type: 'Phishing Attempts', count: Math.floor(baseEvents * 0.04), severity: 'medium' },
        { type: 'Suspicious Login Patterns', count: Math.floor(baseEvents * 0.03), severity: 'medium' },
        { type: 'Document Fraud', count: Math.floor(baseEvents * 0.02), severity: 'high' },
        { type: 'Payment Fraud', count: Math.floor(baseEvents * 0.01), severity: 'high' }
      ]
    };
  }

  // Performance Analytics
  static async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      averageResponseTime: 150 + Math.random() * 100, // ms
      uptime: 0.999 + Math.random() * 0.0009,
      errorRate: 0.001 + Math.random() * 0.004,
      throughput: 1000 + Math.random() * 500, // requests per minute
      latencyDistribution: [
        { percentile: 50, latency: 120 + Math.random() * 30 },
        { percentile: 90, latency: 200 + Math.random() * 50 },
        { percentile: 95, latency: 300 + Math.random() * 100 },
        { percentile: 99, latency: 500 + Math.random() * 200 }
      ],
      topErrorTypes: [
        { type: 'Network Timeouts', count: 15, impact: 'medium' },
        { type: 'Database Connection', count: 8, impact: 'high' },
        { type: 'API Rate Limits', count: 12, impact: 'low' },
        { type: 'Validation Errors', count: 25, impact: 'low' }
      ]
    };
  }

  // Predictive Analytics
  static async getPredictiveInsights(): Promise<PredictiveInsights> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      transactionVolumeForecast: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        predicted: Math.floor(500000 + Math.sin(i * 0.2) * 100000 + Math.random() * 50000),
        confidence: 0.75 + Math.random() * 0.2
      })),
      userGrowthPrediction: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        predicted: Math.floor(35000 * Math.pow(1.12, i) + Math.random() * 2000),
        confidence: 0.8 - i * 0.02
      })),
      revenueProjection: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        projected: Math.floor(750000 * Math.pow(1.15, i) + Math.random() * 50000),
        confidence: 0.85 - i * 0.015
      })),
      riskAssessment: [
        { category: 'Market Competition', risk: 'medium', impact: 7 },
        { category: 'Regulatory Changes', risk: 'low', impact: 4 },
        { category: 'Technology Disruption', risk: 'medium', impact: 8 },
        { category: 'Economic Downturn', risk: 'low', impact: 6 },
        { category: 'Security Threats', risk: 'medium', impact: 9 }
      ],
      recommendations: [
        { type: 'Revenue Optimization', priority: 'high', description: 'Implement dynamic pricing for escrow fees based on transaction risk', estimatedImpact: '+12% revenue' },
        { type: 'User Acquisition', priority: 'medium', description: 'Launch referral program to increase organic growth', estimatedImpact: '+25% new users' },
        { type: 'Security Enhancement', priority: 'high', description: 'Upgrade fraud detection algorithms to reduce false positives', estimatedImpact: '-30% fraud losses' },
        { type: 'Performance', priority: 'medium', description: 'Optimize database queries to improve response times', estimatedImpact: '-40% latency' },
        { type: 'Market Expansion', priority: 'low', description: 'Consider expanding to B2B segment', estimatedImpact: '+50% TAM' }
      ]
    };
  }

  // Real-time Dashboard Data
  static async getRealTimeMetrics(): Promise<{
    activeUsers: number;
    activeTransactions: number;
    systemHealth: 'healthy' | 'warning' | 'critical';
    currentThroughput: number;
    recentAlerts: { type: string; message: string; timestamp: string; severity: 'info' | 'warning' | 'error' }[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      activeUsers: 1250 + Math.floor(Math.random() * 200),
      activeTransactions: 45 + Math.floor(Math.random() * 20),
      systemHealth: Math.random() > 0.9 ? 'warning' : 'healthy',
      currentThroughput: 850 + Math.floor(Math.random() * 300),
      recentAlerts: [
        { type: 'Security', message: 'Unusual login pattern detected for user ID 12345', timestamp: new Date(Date.now() - 300000).toISOString(), severity: 'warning' },
        { type: 'Performance', message: 'Database query response time above threshold', timestamp: new Date(Date.now() - 600000).toISOString(), severity: 'info' },
        { type: 'Transaction', message: 'High-value transaction flagged for review', timestamp: new Date(Date.now() - 900000).toISOString(), severity: 'info' }
      ]
    };
  }

  // Export Analytics Data
  static async exportAnalytics(type: 'transactions' | 'users' | 'revenue' | 'security', format: 'csv' | 'json' | 'pdf', period: string): Promise<{ downloadUrl: string; fileName: string }> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      downloadUrl: `blob:${Date.now()}`,
      fileName: `${type}_analytics_${period}.${format}`
    };
  }
}