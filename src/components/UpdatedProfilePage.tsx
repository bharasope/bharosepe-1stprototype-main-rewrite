
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Settings, Save, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import BottomNavigation from '@/components/BottomNavigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EnhancedProfile from '@/components/EnhancedProfile';
import { useUserModeContext } from '@/components/UserModeContext';
import HeaderWithRoleToggle from '@/components/HeaderWithRoleToggle';

const mockUserData = {
  name: 'John Doe',
  phone: '9876543210',
  email: 'john.doe@example.com',
  accountNumber: '••••••1234',
  ifscCode: '•••••0001',
  upiId: 'johndoe@upi',
  rating: 4.7,
  transactionCount: 28,
  joinedDate: 'June 2023',
  completionRate: 98,
  responseRate: 95,
  responseTime: 'Within 1 hour',
  verified: true,
  badges: ['trusted_seller', 'fast_shipper', 'top_rated']
};

const UpdatedProfilePage = () => {
  const navigate = useNavigate();
  const { userMode } = useUserModeContext();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: mockUserData.name,
    phone: mockUserData.phone,
    email: mockUserData.email,
    accountNumber: mockUserData.accountNumber,
    ifscCode: mockUserData.ifscCode,
    upiId: mockUserData.upiId
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    // Simulate saving profile
    setTimeout(() => {
      setIsEditing(false);
      toast.success("Profile updated successfully");
    }, 1000);
  };

  return (
    <div className="bharose-container pb-20">
      <HeaderWithRoleToggle 
        title="My Profile" 
        showNotifications 
        notificationCount={3}
      />
      
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-end py-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : <Settings size={16} className="mr-1" />}
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>

        <div className="bharose-card mb-6 flex flex-col items-center py-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="https://source.unsplash.com/random/200x200/?portrait" alt="Profile" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-semibold">{formData.name}</h2>
          <p className="text-muted-foreground">{formData.phone}</p>
          <p className="text-muted-foreground text-sm">{formData.email}</p>
          
          {mockUserData.verified && (
            <div className="flex items-center gap-1 text-bharose-success mt-2">
              <Shield size={14} />
              <span className="text-sm">Verified User</span>
            </div>
          )}
          
          {isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
            >
              Change Photo
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="reputation">Reputation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-6">
            <div className="bharose-card">
              <h3 className="font-medium mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex items-center border rounded-md">
                    <div className="px-3 py-2 text-muted-foreground">
                      <User size={18} />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-0"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center border rounded-md">
                    <div className="px-3 py-2 text-muted-foreground">
                      <Phone size={18} />
                    </div>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-0"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center border rounded-md">
                    <div className="px-3 py-2 text-muted-foreground">
                      <Mail size={18} />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-6">
            <div className="bharose-card">
              <h3 className="font-medium mb-4">Payment Details</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="accountNumber">Bank Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reputation" className="space-y-6">
            <div className="bharose-card">
              <EnhancedProfile user={mockUserData} />
            </div>
          </TabsContent>
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
      
      <BottomNavigation userMode={userMode} />
    </div>
  );
};

export default UpdatedProfilePage;
