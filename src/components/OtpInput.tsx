
import React, { useState, useRef, useEffect } from 'react';

interface OtpInputProps {
  length: number;
  onComplete: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Pre-populate refs array with nulls
  useEffect(() => {
    inputRefs.current = Array(length).fill(null);
  }, [length]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only accept digits
    if (!/^\d*$/.test(value)) return;
    
    // Only accept single digits
    if (value.length > 1) return;
    
    // Update the OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-advance to next input if a digit was entered
    if (value !== '' && index < length - 1) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
    
    // Check if OTP is complete
    const otpValue = newOtp.join('');
    if (otpValue.length === length && !newOtp.includes('')) {
      setTimeout(() => {
        onComplete(otpValue);
      }, 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      const newOtp = [...otp];
      
      if (otp[index] !== '') {
        // Clear current input and stay focused
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = '';
        setOtp(newOtp);
        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 0);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const pastedDigits = pastedData.replace(/\D/g, '').slice(0, length).split('');
    
    if (pastedDigits.length > 0) {
      const newOtp = [...otp];
      pastedDigits.forEach((digit, idx) => {
        if (idx < length) {
          newOtp[idx] = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus the appropriate input after paste
      const lastIndex = Math.min(pastedDigits.length, length) - 1;
      if (lastIndex >= 0 && lastIndex < length - 1) {
        setTimeout(() => {
          inputRefs.current[lastIndex + 1]?.focus();
        }, 0);
      }
      
      // Check if OTP is complete
      const otpValue = newOtp.join('');
      if (otpValue.length === length && !newOtp.includes('')) {
        setTimeout(() => {
          onComplete(otpValue);
        }, 100);
      }
    }
  };

  return (
    <div className="flex justify-between gap-2 mt-4">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-xl font-semibold rounded-lg border border-input bg-background focus:border-bharose-primary focus:ring-1 focus:ring-bharose-primary"
          inputMode="numeric"
          pattern="[0-9]*"
        />
      ))}
    </div>
  );
};

export default OtpInput;
