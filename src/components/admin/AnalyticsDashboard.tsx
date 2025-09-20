import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, IndianRupee, Shield, Activity,
  Download, RefreshCw, AlertTriangle, CheckCircle, Clock, Target
} from 'lucide-react';
import { AnalyticsService, type TransactionMetrics, type UserMetrics, type RevenueMetrics, type SecurityMetrics } from '@/services/analyticsService';
import { toast } from 'sonner';

const AnalyticsDashboard = () => {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(false);
  const [transactionMetrics, setTransactionMetrics] = useState<TransactionMetrics | null>(null);
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics | null>(null);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [realTimeData, setRealTimeData] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
    loadRealTimeData();
    
    // Set up real-time data refresh
    const interval = setInterval(loadRealTimeData, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [transactions, users, revenue, security] = await Promise.all([
        AnalyticsService.getTransactionMetrics(period),
        AnalyticsService.getUserMetrics(period),
        AnalyticsService.getRevenueMetrics(period),
        AnalyticsService.getSecurityMetrics(period)
      ]);

      setTransactionMetrics(transactions);
      setUserMetrics(users);
      setRevenueMetrics(revenue);
      setSecurityMetrics(security);
    } catch (error) {
      toast.error('Failed to load analytics data');
      console.error('Analytics loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeData = async () => {
    try {
      const data = await AnalyticsService.getRealTimeMetrics();
      setRealTimeData(data);
    } catch (error) {
      console.error('Real-time data loading error:', error);
    }
  };

  const exportData = async (type: 'transactions' | 'users' | 'revenue' | 'security', format: 'csv' | 'pdf') => {
    try {
      toast.success(`Exporting ${type} data as ${format.toUpperCase()}...`);
      const result = await AnalyticsService.exportAnalytics(type, format, period);
      // In a real app, trigger download
      console.log('Export result:', result);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  if (loading && !transactionMetrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-bharose-primary" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading Analytics Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Comprehensive platform insights and metrics</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {(['24h', '7d', '30d', '90d'] as const).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
            <Button onClick={loadAnalytics} disabled={loading} size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Real-time Status Bar */}
        {realTimeData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                    <p className="text-2xl font-bold text-green-600">{realTimeData.activeUsers.toLocaleString()}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Transactions</p>
                    <p className="text-2xl font-bold text-blue-600">{realTimeData.activeTransactions}</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">System Health</p>
                    <Badge variant={realTimeData.systemHealth === 'healthy' ? 'default' : 'destructive'}>
                      {realTimeData.systemHealth}
                    </Badge>
                  </div>
                  {realTimeData.systemHealth === 'healthy' ? 
                    <CheckCircle className="h-8 w-8 text-green-500" /> :
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  }
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Throughput</p>
                    <p className="text-2xl font-bold text-orange-600">{realTimeData.currentThroughput}/min</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {transactionMetrics && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{transactionMetrics.totalVolume.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={`inline-flex items-center ${transactionMetrics.monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transactionMetrics.monthlyGrowth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {Math.abs(transactionMetrics.monthlyGrowth).toFixed(1)}% from last month
                      </span>
                    </p>
                  </CardContent>
                </Card>
              )}

              {userMetrics && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userMetrics.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      {userMetrics.newUsers.toLocaleString()} new this period
                    </p>
                  </CardContent>
                </Card>
              )}

              {revenueMetrics && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{revenueMetrics.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+{revenueMetrics.projectedGrowth.toFixed(1)}% projected growth</span>
                    </p>
                  </CardContent>
                </Card>
              )}

              {securityMetrics && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Security Events</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{securityMetrics.totalSecurityEvents}</div>
                    <p className="text-xs text-muted-foreground">
                      {securityMetrics.fraudAttempts} fraud attempts blocked
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Overview Charts */}
            {transactionMetrics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Trend</CardTitle>
                    <CardDescription>Daily transaction volume over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={transactionMetrics.weeklyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Volume']} />
                        <Area type="monotone" dataKey="volume" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                    <CardDescription>Transaction volume by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={transactionMetrics.topCategories}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="volume"
                          label={({ category, volume }) => `${category}: ₹${Number(volume).toLocaleString()}`}
                        >
                          {transactionMetrics.topCategories.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Volume']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            {transactionMetrics && (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Transaction Analytics</h2>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => exportData('transactions', 'csv')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button size="sm" onClick={() => exportData('transactions', 'pdf')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        {(transactionMetrics.successRate * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600">Of all transactions</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Average Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        ₹{transactionMetrics.averageValue.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">Per transaction</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Total Count</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {transactionMetrics.totalCount.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">Transactions</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Hourly Distribution</CardTitle>
                    <CardDescription>Transaction count by hour of day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={transactionMetrics.hourlyDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {userMetrics && (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">User Analytics</h2>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => exportData('users', 'csv')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Retention Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">
                        {(userMetrics.retentionRate * 100).toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        {userMetrics.activeUsers.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>New Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">
                        {userMetrics.newUsers.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Avg Session</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-600">
                        {userMetrics.averageSessionTime.toFixed(0)}m
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={userMetrics.topUserTypes}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="count"
                            label={({ type, percentage }) => `${type}: ${percentage}%`}
                          >
                            {userMetrics.topUserTypes.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Geographic Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={userMetrics.geographicDistribution.slice(0, 5)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="state" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            {revenueMetrics && (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Revenue Analytics</h2>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => exportData('revenue', 'csv')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        ₹{revenueMetrics.totalRevenue.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Recurring</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">
                        ₹{revenueMetrics.monthlyRecurring.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Avg Transaction Fee</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">
                        ₹{revenueMetrics.averageTransactionFee.toFixed(0)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Customer LTV</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-600">
                        ₹{revenueMetrics.customerLifetimeValue.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueMetrics.revenueByService}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="service" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']} />
                        <Bar dataKey="revenue" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {securityMetrics && (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Security Analytics</h2>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => exportData('security', 'csv')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {securityMetrics.totalSecurityEvents}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Fraud Attempts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-600">
                        {securityMetrics.fraudAttempts}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Successful Verifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        {securityMetrics.successfulVerifications}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Failed Logins</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-yellow-600">
                        {securityMetrics.failedLogins}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Score Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={securityMetrics.securityScoreDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="count"
                            label={({ score, count }) => `${score}: ${count}`}
                          >
                            {securityMetrics.securityScoreDistribution.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Threat Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {securityMetrics.topThreatTypes.map((threat, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{threat.type}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant={threat.severity === 'high' ? 'destructive' : threat.severity === 'medium' ? 'secondary' : 'outline'}>
                                {threat.severity}
                              </Badge>
                              <span className="text-sm font-medium">{threat.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;