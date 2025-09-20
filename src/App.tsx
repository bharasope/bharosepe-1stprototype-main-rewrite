import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { UserModeProvider } from '@/components/UserModeContext';
import { ThemeProvider } from '@/hooks/use-theme';

// Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import KycVerification from '@/pages/KycVerification';
import TransactionSetup from '@/pages/TransactionSetup';
import InitiateTransaction from '@/pages/InitiateTransaction';
import Payment from '@/pages/Payment';
import TransactionStatus from '@/pages/TransactionStatus';
import Transactions from '@/pages/Transactions';
import Notifications from '@/pages/Notifications';
import AgreementSent from '@/pages/AgreementSent';
import AgreementReceived from '@/pages/AgreementReceived';
import AiAgreementGeneration from '@/pages/AiAgreementGeneration';
import Profile from '@/pages/Profile';
import Help from '@/pages/Help';
import Listings from '@/pages/Listings';
import ListingDetails from '@/pages/ListingDetails';
import Dispute from '@/pages/Dispute';
import SplashScreen from '@/pages/SplashScreen';
import OnboardingPage from '@/pages/OnboardingPage';
import ProfileSetup from '@/pages/ProfileSetup';
import NotFound from '@/pages/NotFound';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserModeProvider>
          <div className="app">
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/splash" element={<SplashScreen />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/kyc-verification" element={<KycVerification />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transaction-setup" element={<TransactionSetup />} />
                <Route path="/initiate-transaction" element={<InitiateTransaction />} />
                <Route path="/ai-agreement-generation" element={<AiAgreementGeneration />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/transaction-status/:id" element={<TransactionStatus />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/agreement-sent" element={<AgreementSent />} />
                <Route path="/agreement/:id" element={<AgreementReceived />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/help" element={<Help />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/listing/:id" element={<ListingDetails />} />
                <Route path="/dispute/:id" element={<Dispute />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </div>
        </UserModeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;