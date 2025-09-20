
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AgreementSent = () => {
  const navigate = useNavigate();

  return (
    <div className="bharose-container justify-center items-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-bharose-primary mb-2">
            Agreement Sent Successfully!
          </h1>
          <p className="text-muted-foreground">
            Your digital agreement has been sent to the other party for review and acceptance.
          </p>
        </div>

        <div className="bharose-card text-left space-y-4">
          <h3 className="font-semibold">What happens next?</h3>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Waiting for Response</h4>
                <p className="text-sm text-muted-foreground">
                  The other party will receive a notification to review the agreement
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Agreement Acceptance</h4>
                <p className="text-sm text-muted-foreground">
                  You'll be notified when they accept or reject the agreement
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-bharose-primary/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <MessageSquare className="h-4 w-4 text-bharose-primary" />
              </div>
              <div>
                <h4 className="font-medium">Escrow Payment</h4>
                <p className="text-sm text-muted-foreground">
                  Once accepted, buyer will be prompted to make the escrow payment
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-bharose-primary hover:bg-bharose-primary/90"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/transactions')}
            className="w-full"
          >
            View All Transactions
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>You can track the status of this agreement in your transactions page.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AgreementSent;
