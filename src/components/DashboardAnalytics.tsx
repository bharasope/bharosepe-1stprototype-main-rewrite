
import React from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransactionStore, TransactionStatus } from '@/utils/transactionState';

interface AnalyticsProps {
  userMode: string;
}

const COLORS = ['#6E59A5', '#F97316', '#EA384C'];

const DashboardAnalytics: React.FC<AnalyticsProps> = ({ userMode }) => {
  const { transactions } = useTransactionStore();
  
  // Filter transactions by role based on user mode
  const userTransactions = transactions.filter(tx => 
    userMode === 'Buyer' ? tx.role === 'buyer' : tx.role === 'seller'
  );
  
  // Generate status data for pie chart
  const statusData = [
    { name: 'Active', value: userTransactions.filter(tx => tx.status === 'in-progress').length },
    { name: 'Completed', value: userTransactions.filter(tx => tx.status === 'completed').length },
    { name: 'Disputed', value: userTransactions.filter(tx => tx.status === 'disputed').length },
  ];
  
  // Generate monthly transaction data for bar chart (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthYear = `${d.toLocaleString('default', { month: 'short' })}`;
    
    return {
      month: monthYear,
      amount: Math.floor(Math.random() * 50000) + 10000, // Simulated data
    };
  }).reverse();

  return (
    <div className="bharose-card mt-4">
      <h2 className="text-lg font-semibold mb-4">Transaction Analytics</h2>
      
      <Tabs defaultValue="status">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="status" className="flex items-center gap-1">
            <PieChartIcon size={16} />
            Status
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-1">
            <BarChart3 size={16} />
            Monthly
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="monthly" className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
              <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="amount" fill="#6E59A5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardAnalytics;
