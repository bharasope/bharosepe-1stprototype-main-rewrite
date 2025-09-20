
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, FileText, CheckCircle, XCircle, Eye, CreditCard, Upload, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HeaderWithProfileToggle from '@/components/HeaderWithProfileToggle';
import BottomNavigation from '@/components/BottomNavigation';
import { useProfileManager } from '@/hooks/use-profile-manager';
import { useEnhancedTransactionStore } from '@/utils/enhancedTransactionState';
import { toast } from 'sonner';

const Notifications = () => {
  const navigate = useNavigate();
  const { currentProfile } = useProfileManager();
  const { 
    getNotificationsByProfile, 
    getAgreementsByProfile,
    markNotificationAsRead, 
    updateAgreementStatus 
  } = useEnhancedTransactionStore();

  const notifications = getNotificationsByProfile(currentProfile.id);
  const agreements = getAgreementsByProfile(currentProfile.id);

  const handleNotificationClick = (notification: any) => {
    markNotificationAsRead(notification.id);
    
    if (notification.type === 'contract_sent' && notification.relatedId) {
      navigate(`/agreement/${notification.relatedId}`);
    } else if (notification.type === 'payment_received' && notification.relatedId) {
      navigate(`/transaction-status/${notification.relatedId}`);
    } else if (notification.type === 'delivery_confirmation_required' && notification.relatedId) {
      navigate(`/transaction-status/${notification.relatedId}`);
    } else if (notification.type === 'funds_released' && notification.relatedId) {
      navigate(`/transaction-status/${notification.relatedId}`);
    } else if (notification.relatedId) {
      navigate(`/agreement/${notification.relatedId}`);
    }
  };

  const handleQuickAccept = (agreementId: string) => {
    updateAgreementStatus(agreementId, 'accepted', 'Quick accepted from notifications');
    toast.success('Contract accepted! Payment process initiated.');
  };

  const handleQuickReject = (agreementId: string) => {
    updateAgreementStatus(agreementId, 'rejected', 'Quick rejected from notifications');
    toast.success('Contract rejected.');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'contract_sent':
        return <FileText size={20} className="text-blue-500" />;
      case 'contract_accepted':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'contract_rejected':
        return <XCircle size={20} className="text-red-500" />;
      case 'payment_received':
        return <CreditCard size={20} className="text-green-600" />;
      case 'delivery_required':
        return <Upload size={20} className="text-orange-500" />;
      case 'delivery_confirmation_required':
        return <Truck size={20} className="text-blue-600" />;
      case 'funds_released':
        return <CheckCircle size={20} className="text-green-600" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'payment_received':
        return 'border-l-green-500';
      case 'contract_sent':
        return 'border-l-blue-500';
      case 'contract_accepted':
        return 'border-l-green-500';
      case 'contract_rejected':
        return 'border-l-red-500';
      case 'delivery_required':
        return 'border-l-orange-500';
      case 'delivery_confirmation_required':
        return 'border-l-blue-600';
      case 'funds_released':
        return 'border-l-green-600';
      default:
        return 'border-l-bharose-primary';
    }
  };

  return (
    <div className="bharose-container pb-20">
      <HeaderWithProfileToggle 
        title="Notifications"
        showBack={true}
        showNotifications={false}
        showUserToggle={false}
        showProfileToggle={true}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4"
      >
        {notifications.length === 0 ? (
          <div className="bharose-card flex flex-col items-center justify-center py-12">
            <Bell size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No notifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const relatedAgreement = notification.relatedId 
                ? agreements.find(a => a.id === notification.relatedId)
                : null;
                
              return (
                <motion.div
                  key={notification.id}
                  className={`bharose-card cursor-pointer ${!notification.read ? `border-l-4 ${getNotificationColor(notification.type)}` : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        {!notification.read && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>

                      {/* Quick actions for pending contracts */}
                      {notification.type === 'contract_sent' && 
                       relatedAgreement && 
                       relatedAgreement.status === 'pending' && 
                       relatedAgreement.receiverProfileId === currentProfile.id && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickAccept(relatedAgreement.id);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickReject(relatedAgreement.id);
                            }}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <XCircle size={14} className="mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(notification);
                            }}
                          >
                            <Eye size={14} className="mr-1" />
                            Review
                          </Button>
                        </div>
                      )}

                      {/* Action buttons for other notification types */}
                      {(notification.type === 'payment_received' || 
                        notification.type === 'delivery_confirmation_required' ||
                        notification.type === 'funds_released') && (
                        <div className="mt-3">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(notification);
                            }}
                            className="bg-bharose-primary hover:bg-bharose-primary/90"
                          >
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      <BottomNavigation userMode={currentProfile.role} />
    </div>
  );
};

export default Notifications;
