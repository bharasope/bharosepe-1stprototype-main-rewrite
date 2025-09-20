import { create } from 'zustand';

// Type definitions
export type Status = 'created' | 'paid' | 'in-progress' | 'confirmed' | 'completed';
export type TransactionStatus = 'in-progress' | 'completed' | 'disputed';
export type TransactionRole = 'buyer' | 'seller';
export type UserMode = 'Buyer' | 'Seller';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  counterparty: string;
  role: TransactionRole;
  description?: string;
  disputeDetails?: string;
  sellerPhone?: string;
  buyerPhone?: string;
  sellerEmail?: string;
  buyerEmail?: string;
  hasEvidence?: boolean;
  // Add buyer and seller names for proper display
  buyerName?: string;
  sellerName?: string;
}

export interface Listing {
  id: string;
  title: string;
  type: 'product' | 'service';
  price: number;
  terms: string;
  image?: string;
  status: 'active' | 'inactive';
  sellerPhone: string;
  sellerId: string;
  description?: string;
}

export type Seller = {
  id: string;
  phone: string;
  name: string;
  listings: Listing[];
};

interface TransactionState {
  transactions: Transaction[];
  sellers: Seller[];
  listings: Listing[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => string;
  updateTransactionStatus: (id: string, status: TransactionStatus, disputeDetails?: string, hasEvidence?: boolean) => void;
  getActiveTransactions: () => Transaction[];
  getEscrowBalance: (userMode: UserMode) => number;
  getTransactionsByStatus: (status: TransactionStatus | 'all') => Transaction[];
  getSellerListings: (sellerPhone: string) => Listing[];
  getSellerById: (id: string) => Seller | undefined;
  getSellerByPhone: (phone: string) => Seller | undefined;
  removeListing: (id: string) => void;
  addListing: (listing: Omit<Listing, 'id' | 'status'>) => void;
}

// Create dummy sellers with listings
const dummySellers: Seller[] = [
  {
    id: 'SELLER001',
    phone: '9999990001',
    name: 'Tech Solutions',
    listings: [
      {
        id: 'list001',
        title: 'Used Laptop',
        type: 'product',
        price: 25000,
        terms: '3-day delivery, 7-day warranty',
        image: 'https://source.unsplash.com/random/300x200/?laptop',
        status: 'active',
        sellerPhone: '9999990001',
        sellerId: 'SELLER001',
        description: 'Refurbished laptop in excellent condition with 8GB RAM and 256GB SSD.'
      },
      {
        id: 'list002',
        title: 'Mobile Repair Service',
        type: 'service',
        price: 500,
        terms: 'Same day service, 1-month warranty',
        image: 'https://source.unsplash.com/random/300x200/?repair',
        status: 'active',
        sellerPhone: '9999990001',
        sellerId: 'SELLER001',
        description: 'Professional repair service for all smartphone models.'
      }
    ]
  },
  {
    id: 'SELLER002',
    phone: '9999990002',
    name: 'Creative Studio',
    listings: [
      {
        id: 'list003',
        title: 'Graphic Design Service',
        type: 'service',
        price: 2000,
        terms: '2 revisions, delivery in 3 days',
        image: 'https://source.unsplash.com/random/300x200/?design',
        status: 'active',
        sellerPhone: '9999990002',
        sellerId: 'SELLER002',
        description: 'Professional graphic design for logos, banners, and marketing materials.'
      },
      {
        id: 'list004',
        title: 'T-shirt Pack',
        type: 'product',
        price: 799,
        terms: '7-day delivery, no returns',
        image: 'https://source.unsplash.com/random/300x200/?tshirt',
        status: 'active',
        sellerPhone: '9999990002',
        sellerId: 'SELLER002',
        description: 'Pack of 3 high-quality cotton t-shirts in various colors.'
      }
    ]
  },
  {
    id: 'SELLER003',
    phone: '9999990003',
    name: 'Wellness & Crafts',
    listings: [
      {
        id: 'list005',
        title: 'Yoga Classes',
        type: 'service',
        price: 1200,
        terms: '4 sessions, valid for 1 month',
        image: 'https://source.unsplash.com/random/300x200/?yoga',
        status: 'active',
        sellerPhone: '9999990003',
        sellerId: 'SELLER003',
        description: 'Professional yoga instruction for beginners and intermediate practitioners.'
      },
      {
        id: 'list006',
        title: 'Handmade Jewelry',
        type: 'product',
        price: 1500,
        terms: '5-day delivery, customization available',
        image: 'https://source.unsplash.com/random/300x200/?jewelry',
        status: 'active',
        sellerPhone: '9999990003',
        sellerId: 'SELLER003',
        description: 'Handcrafted artisanal jewelry pieces made with high-quality materials.'
      }
    ]
  }
];

// Sample initial transactions - Updated with proper buyer/seller names
const initialTransactions: Transaction[] = [
  // Buyer's transactions (Amit buying from Rahul)
  {
    id: 'tx1',
    title: 'iPhone 12 Pro',
    amount: 65000,
    status: 'in-progress',
    date: '2 days ago',
    counterparty: 'Rahul Kumar',
    role: 'buyer',
    sellerPhone: '9999990001',
    sellerEmail: 'rahul@example.com',
    buyerName: 'Amit Singh',
    sellerName: 'Rahul Kumar'
  },
  {
    id: 'tx3',
    title: 'Gaming Laptop',
    amount: 85000,
    status: 'completed',
    date: '3 days ago',
    counterparty: 'Rahul Kumar',
    role: 'buyer',
    sellerPhone: '9999990001',
    sellerEmail: 'rahul@example.com',
    buyerName: 'Amit Singh',
    sellerName: 'Rahul Kumar'
  },
  {
    id: 'tx4',
    title: 'Wireless Headphones',
    amount: 4500,
    status: 'in-progress',
    date: '1 day ago',
    counterparty: 'Rahul Kumar',
    role: 'buyer',
    sellerPhone: '9999990001',
    sellerEmail: 'rahul@example.com',
    buyerName: 'Amit Singh',
    sellerName: 'Rahul Kumar'
  },
  {
    id: 'tx5',
    title: 'Digital Camera',
    amount: 35000,
    status: 'completed',
    date: '5 days ago',
    counterparty: 'Rahul Kumar',
    role: 'buyer',
    sellerPhone: '9999990001',
    sellerEmail: 'rahul@example.com',
    buyerName: 'Amit Singh',
    sellerName: 'Rahul Kumar'
  },
  {
    id: 'tx6',
    title: 'Smart Watch',
    amount: 12000,
    status: 'disputed',
    date: '1 week ago',
    counterparty: 'Rahul Kumar',
    role: 'buyer',
    sellerPhone: '9999990001',
    sellerEmail: 'rahul@example.com',
    disputeDetails: 'Product arrived damaged',
    hasEvidence: true,
    buyerName: 'Amit Singh',
    sellerName: 'Rahul Kumar'
  },
  {
    id: 'tx10',
    title: 'Furniture Set',
    amount: 45000,
    status: 'in-progress',
    date: '4 days ago',
    counterparty: 'Rahul Kumar',
    role: 'buyer',
    sellerPhone: '9999990001',
    sellerEmail: 'rahul@example.com',
    buyerName: 'Amit Singh',
    sellerName: 'Rahul Kumar'
  },
  // Seller's transactions (Rahul selling to Amit)
  {
    id: 'tx2',
    title: 'Logo Design',
    amount: 3500,
    status: 'in-progress',
    date: '1 week ago',
    counterparty: 'Amit Singh',
    role: 'seller',
    buyerPhone: '9876543210',
    buyerEmail: 'amit@example.com',
    buyerName: 'Amit Singh',
    sellerName: 'Rahul Kumar'
  },
  {
    id: 'tx7',
    title: 'Web Development',
    amount: 25000,
    status: 'in-progress',
    date: '3 days ago',
    counterparty: 'Amit Singh',
    role: 'seller',
    buyerPhone: '9876543210',
    buyerEmail: 'amit@example.com',
    buyerName: 'Amit Singh',
    sellerName: 'Rahul Kumar'
  },
  {
    id: 'tx8',
    title: 'Content Writing',
    amount: 8000,
    status: 'completed',
    date: '1 week ago',
    counterparty: 'Amit Singh',
    role: 'seller',
    buyerPhone: '9876543210',
    buyerEmail: 'amit@example.com',
    buyerName: 'Amit Singh',
    sellerName: 'Rahul Kumar'
  },
  {
    id: 'tx9',
    title: 'UI/UX Design',
    amount: 18000,
    status: 'disputed',
    date: '2 weeks ago',
    counterparty: 'Amit Singh',
    role: 'seller',
    buyerPhone: '9876543210',
    buyerEmail: 'amit@example.com',
    disputeDetails: 'Client claims design does not match requirements',
    hasEvidence: true,
    buyerName: 'Amit Singh',
    sellerName: 'Rahul Kumar'
  },
  {
    id: 'tx11',
    title: 'Marketing Services',
    amount: 12000,
    status: 'in-progress',
    date: '6 days ago',
    counterparty: 'Amit Singh',
    role: 'seller',
    buyerPhone: '9876543210',
    buyerEmail: 'amit@example.com',
    buyerName: 'Amit Singh',
    sellerName: 'Rahul Kumar'
  }
];

// Create a unified store for all transactions
export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: initialTransactions,
  sellers: dummySellers,
  listings: dummySellers.flatMap(seller => seller.listings),
  
  addTransaction: (transaction) => {
    const newTransactionId = `tx${get().transactions.length + 1}`;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: newTransactionId,
      date: 'Just now',
    };
    
    set(state => ({
      transactions: [newTransaction, ...state.transactions]
    }));
    
    return newTransactionId; // Return the new transaction ID for redirection
  },
  
  updateTransactionStatus: (id, status, disputeDetails, hasEvidence) => set(state => ({
    transactions: state.transactions.map(tx => 
      tx.id === id 
        ? { 
            ...tx, 
            status, 
            ...(disputeDetails && { disputeDetails }),
            ...(hasEvidence !== undefined && { hasEvidence })
          } 
        : tx
    )
  })),
  
  getActiveTransactions: () => {
    return get().transactions.filter(tx => 
      tx.status === 'in-progress'
    );
  },
  
  getEscrowBalance: (userMode) => {
    // Only show the sum of transactions with 'in-progress' status
    return get().transactions
      .filter(tx => 
        tx.status === 'in-progress' && 
        (userMode === 'Buyer' ? tx.role === 'buyer' : tx.role === 'seller')
      )
      .reduce((sum, tx) => sum + tx.amount, 0);
  },
  
  getTransactionsByStatus: (status) => {
    return status === 'all' 
      ? get().transactions 
      : get().transactions.filter(tx => tx.status === status);
  },
  
  getSellerListings: (sellerPhone) => {
    return get().listings.filter(listing => listing.sellerPhone === sellerPhone && listing.status === 'active');
  },
  
  getSellerById: (id) => {
    return get().sellers.find(seller => seller.id === id);
  },
  
  getSellerByPhone: (phone) => {
    return get().sellers.find(seller => seller.phone === phone);
  },
  
  removeListing: (id) => set(state => ({
    listings: state.listings.filter(listing => listing.id !== id)
  })),
  
  addListing: (listing) => set(state => {
    const newListing: Listing = {
      ...listing,
      id: `list${state.listings.length + 100}`,
      status: 'active',
    };
    
    return {
      listings: [newListing, ...state.listings]
    };
  }),
}));
