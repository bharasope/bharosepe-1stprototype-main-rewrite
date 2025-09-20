
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import BottomNavigation from '@/components/BottomNavigation';
import { useProfileManager } from '@/hooks/use-profile-manager';
import { useTransactionStore } from '@/utils/transactionState';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfilePerformanceMetrics from '@/components/profile/ProfilePerformanceMetrics';
import ProfileRecentActivity from '@/components/profile/ProfileRecentActivity';
import ProfilePersonalInfo from '@/components/profile/ProfilePersonalInfo';
import ProfilePaymentInfo from '@/components/profile/ProfilePaymentInfo';
import ProfileActivityInfo from '@/components/profile/ProfileActivityInfo';


const Profile = () => {
  const { currentProfile } = useProfileManager();
  const { transactions } = useTransactionStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [formData, setFormData] = useState({
    name: currentProfile.name,
    phone: currentProfile.phone,
    email: currentProfile.email,
    accountNumber: '••••••1234',
    ifscCode: '•••••0001',
    upiId: `${currentProfile.name.toLowerCase().replace(' ', '')}@upi`,
    bio: 'Experienced trader with focus on electronics and services',
    location: 'Mumbai, Maharashtra',
    businessHours: '9 AM - 6 PM'
  });

  // Calculate user statistics
  const userStats = useMemo(() => {
    const userTransactions = transactions.filter(tx => 
      (currentProfile.role === 'Seller' && tx.role === 'seller') ||
      (currentProfile.role === 'Buyer' && tx.role === 'buyer')
    );
    
    const completedTransactions = userTransactions.filter(tx => tx.status === 'completed');
    const totalTransactions = userTransactions.length;
    const totalAmount = userTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const successRate = totalTransactions > 0 ? (completedTransactions.length / totalTransactions) * 100 : 0;
    const avgTransactionValue = totalTransactions > 0 ? totalAmount / totalTransactions : 0;
    
    return {
      totalTransactions,
      completedTransactions: completedTransactions.length,
      totalAmount,
      successRate,
      avgTransactionValue,
      disputedTransactions: userTransactions.filter(tx => tx.status === 'disputed').length,
      recentTransactions: userTransactions.slice(0, 5)
    };
  }, [transactions, currentProfile]);

  // Profile completeness calculation
  const profileCompleteness = useMemo(() => {
    const fields = [
      formData.name,
      formData.phone,
      formData.email,
      formData.bio,
      formData.location,
      formData.businessHours,
      formData.accountNumber !== '••••••1234',
      formData.upiId
    ];
    
    const completedFields = fields.filter(field => field && field !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    setTimeout(() => {
      setIsEditing(false);
      toast.success("Profile updated successfully");
    }, 1000);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bharose-container pb-20">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between py-4">
          <h1 className="text-xl font-semibold">My Profile</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : <Settings size={16} className="mr-1" />}
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>

        {/* Profile Header */}
        <ProfileHeader
          formData={formData}
          currentProfile={currentProfile}
          profileCompleteness={profileCompleteness}
          isEditing={isEditing}
          getInitials={getInitials}
        />

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <ProfileStats userStats={userStats} />
            <ProfilePerformanceMetrics userStats={userStats} />
            <ProfileRecentActivity userStats={userStats} />
          </TabsContent>
          
          {/* Personal Tab */}
          <TabsContent value="personal" className="space-y-6">
            <ProfilePersonalInfo
              formData={formData}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
          </TabsContent>
          
          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <ProfilePaymentInfo
              formData={formData}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <ProfileActivityInfo />
          </TabsContent>

          {/* Security Tab */}
        </Tabs>

        {isEditing && (
          <Button 
            className="w-full mt-6 bg-bharose-primary hover:bg-bharose-primary/90"
            onClick={handleSaveProfile}
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </Button>
        )}

        <div className="text-center text-sm text-muted-foreground mt-6">
          <p className="flex items-center justify-center">
            <AlertCircle size={14} className="mr-1" />
            Your data is securely stored
          </p>
        </div>
      </motion.div>
      
      <BottomNavigation userMode={currentProfile.role} />
    </div>
  );
};

export default Profile;
