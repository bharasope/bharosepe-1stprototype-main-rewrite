
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bharose-container justify-center items-center bg-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <motion.img 
          src="/LOGO.png"
          alt="Bharose Pe Logo"
          className="w-64 h-auto mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
      </motion.div>

      <motion.div 
        className="mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="w-12 h-12 rounded-full border-4 border-bharose-primary border-t-transparent animate-spin-slow mx-auto"></div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
