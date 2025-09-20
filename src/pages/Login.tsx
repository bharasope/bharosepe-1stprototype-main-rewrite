import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, ArrowRight } from 'lucide-react';
import OtpInput from '@/components/OtpInput';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setShowOtp(true);
      setLoading(false);
      toast.success('OTP sent successfully!');
    }, 1500);
  };

  const handleOtpComplete = (otp: string) => {
    setLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      toast.success('OTP verified successfully!');
      // Redirect to KYC verification page
      navigate('/kyc-verification');
    }, 1500);
  };

  return (
    <div className="bharose-container">
      <div className="flex-1 flex flex-col justify-center items-center px-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <h1 className="bharose-heading text-3xl">Welcome to Bharose Pe</h1>
            <p className="bharose-subheading mt-2">
              {showOtp ? 'Verify with OTP' : 'Login with your phone number'}
            </p>
          </div>

          {!showOtp ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="bharose-input pl-10"
                  placeholder="Enter your mobile number"
                  required
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                />
              </div>
              
              <button
                type="submit"
                className="bharose-primary-button w-full"
                disabled={phoneNumber.length !== 10 || loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending OTP...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Continue <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <Lock className="mx-auto h-8 w-8 text-bharose-primary mb-2" />
                <p className="text-sm text-muted-foreground">
                  We've sent an OTP to {phoneNumber}
                </p>
              </div>
              
              <OtpInput length={4} onComplete={handleOtpComplete} />
              
              <div className="text-center mt-4">
                <button 
                  className="text-bharose-primary text-sm"
                  onClick={() => setShowOtp(false)}
                >
                  Change phone number
                </button>
              </div>
              
              <div className="text-center mt-4">
                <button className="text-sm text-muted-foreground hover:text-bharose-primary">
                  Resend OTP (30s)
                </button>
              </div>
            </div>
          )}
        </motion.div>

        <p className="text-xs text-muted-foreground mt-8 text-center">
          By continuing, you agree to our{' '}
          <a href="#" className="text-bharose-primary">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-bharose-primary">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
