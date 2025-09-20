
import { create } from 'zustand';
import { Transaction, useTransactionStore } from './transactionState';

export type AgreementStatus = 'pending' | 'accepted' | 'rejected';
export type TransactionStatus = 'contract_sent' | 'contract_accepted' | 'payment_made' | 'awaiting_delivery' | 'delivered' | 'awaiting_confirmation' | 'completed' | 'disputed';

export interface Agreement {
  id: string;
  transactionTitle: string;
  amount: number;
  type: 'goods' | 'services';
  description: string;
  terms: string;
  senderProfileId: string;
  senderName: string;
  senderPhone: string;
  receiverProfileId: string;
  receiverName: string;
  receiverPhone: string;
  status: AgreementStatus;
  createdAt: string;
  respondedAt?: string;
  feedback?: string;
  transactionId?: string;
}

export interface Notification {
  id: string;
  type: 'contract_sent' | 'contract_accepted' | 'payment_received' | 'delivery_required' | 'delivery_confirmation_required' | 'funds_released' | 'contract_rejected';
  title: string;
  message: string;
  profileId: string;
  relatedId?: string;
  createdAt: string;
  read: boolean;
}

export interface DeliveryProof {
  id: string;
  transactionId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  description?: string;
}

export interface EnhancedTransaction {
  id: string;
  status: TransactionStatus;
  updatedAt: string;
  updatedBy: string;
}

interface EnhancedTransactionState {
  agreements: Agreement[];
  notifications: Notification[];
  deliveryProofs: DeliveryProof[];
  enhancedTransactions: EnhancedTransaction[];
  addAgreement: (agreement: Omit<Agreement, 'id' | 'createdAt'>) => string;
  updateAgreementStatus: (id: string, status: AgreementStatus, feedback?: string) => void;
  getAgreementsByProfile: (profileId: string) => Agreement[];
  getNotificationsByProfile: (profileId: string) => Notification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  createTransactionFromAgreement: (agreementId: string) => string | null;
  updateTransactionStatus: (transactionId: string, status: TransactionStatus, profileId: string) => void;
  getTransactionStatus: (transactionId: string) => TransactionStatus;
  addDeliveryProof: (proof: Omit<DeliveryProof, 'id' | 'uploadedAt'>) => void;
  getDeliveryProofs: (transactionId: string) => DeliveryProof[];
}

// Sample agreement from Rahul to Amit
const sampleAgreements: Agreement[] = [
  {
    id: 'agr-001',
    transactionTitle: 'iPhone 14 Pro Max',
    amount: 85000,
    type: 'goods',
    description: 'Brand new iPhone 14 Pro Max, 256GB, Deep Purple. Original box with all accessories included.',
    terms: 'Payment via escrow, 3-day inspection period, shipping within 24 hours of payment confirmation.',
    senderProfileId: 'rahul-seller',
    senderName: 'Rahul Kumar',
    senderPhone: '9999990001',
    receiverProfileId: 'amit-buyer',
    receiverName: 'Amit Singh',
    receiverPhone: '9876543210',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  }
];

// Sample notifications
const sampleNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'contract_sent',
    title: 'New Contract Received',
    message: 'Rahul Kumar sent you a contract for iPhone 14 Pro Max (₹85,000)',
    profileId: 'amit-buyer',
    relatedId: 'agr-001',
    createdAt: sampleAgreements[0].createdAt,
    read: false,
  }
];

// Sample enhanced transactions
const sampleEnhancedTransactions: EnhancedTransaction[] = [];

export const useEnhancedTransactionStore = create<EnhancedTransactionState>((set, get) => ({
  agreements: sampleAgreements,
  notifications: sampleNotifications,
  deliveryProofs: [],
  enhancedTransactions: sampleEnhancedTransactions,

  addAgreement: (agreementData) => {
    const newId = `agr-${Date.now()}`;
    const agreement: Agreement = {
      ...agreementData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    // Add notification for receiver
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'contract_sent',
      title: 'New Contract Received',
      message: `${agreementData.senderName} sent you a contract for ${agreementData.transactionTitle} (₹${agreementData.amount.toLocaleString()})`,
      profileId: agreementData.receiverProfileId,
      relatedId: newId,
      createdAt: new Date().toISOString(),
      read: false,
    };

    set(state => ({
      agreements: [agreement, ...state.agreements],
      notifications: [notification, ...state.notifications],
    }));

    return newId;
  },

  updateAgreementStatus: (id, status, feedback) => {
    const agreement = get().agreements.find(a => a.id === id);
    if (!agreement) return;

    set(state => ({
      agreements: state.agreements.map(agreement =>
        agreement.id === id
          ? {
              ...agreement,
              status,
              respondedAt: new Date().toISOString(),
              feedback,
            }
          : agreement
      ),
    }));

    if (status === 'accepted') {
      const { addTransaction } = useTransactionStore.getState();
      
      const transactionId = addTransaction({
        title: agreement.transactionTitle,
        amount: agreement.amount,
        status: 'in-progress',
        counterparty: agreement.senderName,
        role: 'buyer',
        description: agreement.description,
        sellerPhone: agreement.senderPhone,
        buyerPhone: agreement.receiverPhone,
      });

      // Add to enhanced transactions with initial status
      const enhancedTransaction: EnhancedTransaction = {
        id: transactionId,
        status: 'contract_accepted',
        updatedAt: new Date().toISOString(),
        updatedBy: agreement.receiverProfileId,
      };

      set(state => ({
        agreements: state.agreements.map(agr =>
          agr.id === id ? { ...agr, transactionId } : agr
        ),
        enhancedTransactions: [enhancedTransaction, ...state.enhancedTransactions],
      }));

      const acceptedNotification: Notification = {
        id: `notif-${Date.now()}-accepted`,
        type: 'contract_accepted',
        title: 'Contract Accepted',
        message: `${agreement.receiverName} accepted your contract for ${agreement.transactionTitle}. Waiting for payment.`,
        profileId: agreement.senderProfileId,
        relatedId: id,
        createdAt: new Date().toISOString(),
        read: false,
      };

      set(state => ({
        notifications: [acceptedNotification, ...state.notifications],
      }));
    } else if (status === 'rejected') {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        type: 'contract_rejected',
        title: 'Contract Rejected',
        message: `${agreement.receiverName} rejected your contract for ${agreement.transactionTitle}`,
        profileId: agreement.senderProfileId,
        relatedId: id,
        createdAt: new Date().toISOString(),
        read: false,
      };

      set(state => ({
        notifications: [notification, ...state.notifications],
      }));
    }
  },

  updateTransactionStatus: (transactionId, status, profileId) => {
    const { updateTransactionStatus: updateTxStatus } = useTransactionStore.getState();
    updateTxStatus(transactionId, status === 'completed' ? 'completed' : 'in-progress');

    // Update or create enhanced transaction
    const existingTransaction = get().enhancedTransactions.find(tx => tx.id === transactionId);
    
    if (existingTransaction) {
      set(state => ({
        enhancedTransactions: state.enhancedTransactions.map(tx =>
          tx.id === transactionId
            ? { ...tx, status, updatedAt: new Date().toISOString(), updatedBy: profileId }
            : tx
        ),
      }));
    } else {
      const newEnhancedTransaction: EnhancedTransaction = {
        id: transactionId,
        status,
        updatedAt: new Date().toISOString(),
        updatedBy: profileId,
      };
      
      set(state => ({
        enhancedTransactions: [newEnhancedTransaction, ...state.enhancedTransactions],
      }));
    }

    // Add appropriate notifications based on status change
    if (status === 'payment_made') {
      // Notify seller that payment was received
      const paymentNotification: Notification = {
        id: `notif-${Date.now()}-payment`,
        type: 'payment_received',
        title: 'Payment Received',
        message: `Payment received for transaction ${transactionId}. Please deliver the item/service.`,
        profileId: profileId === 'amit-buyer' ? 'rahul-seller' : 'amit-buyer',
        relatedId: transactionId,
        createdAt: new Date().toISOString(),
        read: false,
      };

      set(state => ({
        notifications: [paymentNotification, ...state.notifications],
      }));
    } else if (status === 'delivered') {
      // Notify buyer to confirm delivery
      const deliveryNotification: Notification = {
        id: `notif-${Date.now()}-delivery`,
        type: 'delivery_confirmation_required',
        title: 'Delivery Confirmation Required',
        message: `Please confirm receipt of your order for transaction ${transactionId}`,
        profileId: profileId === 'rahul-seller' ? 'amit-buyer' : 'rahul-seller',
        relatedId: transactionId,
        createdAt: new Date().toISOString(),
        read: false,
      };

      set(state => ({
        notifications: [deliveryNotification, ...state.notifications],
      }));
    } else if (status === 'completed') {
      // Notify seller that funds are released
      const fundsNotification: Notification = {
        id: `notif-${Date.now()}-funds`,
        type: 'funds_released',
        title: 'Funds Released',
        message: `Funds have been released for transaction ${transactionId}. Transaction completed!`,
        profileId: profileId === 'amit-buyer' ? 'rahul-seller' : 'amit-buyer',
        relatedId: transactionId,
        createdAt: new Date().toISOString(),
        read: false,
      };

      set(state => ({
        notifications: [fundsNotification, ...state.notifications],
      }));
    }
  },

  getTransactionStatus: (transactionId) => {
    const enhancedTransaction = get().enhancedTransactions.find(tx => tx.id === transactionId);
    return enhancedTransaction ? enhancedTransaction.status : 'contract_sent';
  },

  getAgreementsByProfile: (profileId) => {
    return get().agreements.filter(
      agreement => 
        agreement.senderProfileId === profileId || 
        agreement.receiverProfileId === profileId
    );
  },

  getNotificationsByProfile: (profileId) => {
    return get().notifications.filter(
      notification => notification.profileId === profileId
    );
  },

  markNotificationAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      ),
    }));
  },

  addNotification: (notificationData) => {
    const notification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    set(state => ({
      notifications: [notification, ...state.notifications],
    }));
  },

  createTransactionFromAgreement: (agreementId) => {
    const agreement = get().agreements.find(a => a.id === agreementId);
    if (!agreement || agreement.status !== 'accepted') {
      return null;
    }

    const { addTransaction } = useTransactionStore.getState();
    
    const transactionId = addTransaction({
      title: agreement.transactionTitle,
      amount: agreement.amount,
      status: 'in-progress',
      counterparty: agreement.senderName,
      role: 'buyer',
      description: agreement.description,
      sellerPhone: agreement.senderPhone,
      buyerPhone: agreement.receiverPhone,
    });

    return transactionId;
  },

  addDeliveryProof: (proofData) => {
    const proof: DeliveryProof = {
      ...proofData,
      id: `proof-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };

    set(state => ({
      deliveryProofs: [proof, ...state.deliveryProofs],
    }));
  },

  getDeliveryProofs: (transactionId) => {
    return get().deliveryProofs.filter(proof => proof.transactionId === transactionId);
  },
}));
