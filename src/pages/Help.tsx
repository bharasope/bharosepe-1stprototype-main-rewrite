
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Mail,
  Send,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import BottomNavigation from '@/components/BottomNavigation';

interface FAQItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

const Help = () => {
  const { toast } = useToast();
  
  // Contact form state
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    email: '',
    subject: '',
    message: ''
  });
  
  // FAQ items
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      question: 'What is Bharose Pe?',
      answer: 'Bharose Pe is a secure escrow platform for buying and selling products and services. We hold the buyer\'s payment until they confirm they\'re satisfied with what they received, protecting both buyers and sellers from fraud.',
      isOpen: false
    },
    {
      question: 'How do Bharose Coins work?',
      answer: 'Bharose Coins are our loyalty points system. You earn coins on every successful transaction (1% of transaction value). These coins can be used for discounts on platform fees, premium features, or converted to cash once you reach 10,000 coins.',
      isOpen: false
    },
    {
      question: 'How to raise a dispute?',
      answer: 'If you\'re unhappy with a transaction, you can raise a dispute by going to the transaction details and clicking the "Raise Dispute" button. Our support team will review your case within 24 hours and help resolve the issue between both parties.',
      isOpen: false
    },
    {
      question: 'What are the transaction fees?',
      answer: 'Bharose Pe charges a 2% fee from sellers for each successful transaction. Buyers do not pay any platform fees. For high-value transactions above ₹50,000, the fee is reduced to 1.5%.',
      isOpen: false
    },
    {
      question: 'How long does money stay in escrow?',
      answer: 'The money stays in escrow until the buyer confirms receipt and satisfaction with the product or service, or for a maximum of 14 days for products and 30 days for services, after which it is automatically released to the seller if no dispute is raised.',
      isOpen: false
    }
  ]);
  
  // Toggle FAQ item
  const toggleFAQ = (index: number) => {
    setFaqItems(prevItems => 
      prevItems.map((item, i) => 
        i === index ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would send this data to your backend
    console.log('Submitted contact form:', contactForm);
    
    toast({
      title: "Message Sent",
      description: "Our support team will respond to you within 24 hours",
    });
    
    // Reset form
    setContactForm({
      email: '',
      subject: '',
      message: ''
    });
    
    setShowContactForm(false);
  };

  return (
    <div className="bharose-container pb-20">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between py-4">
          <h1 className="text-xl font-semibold">Help Center</h1>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <MessageSquare size={18} className="mr-2 text-bharose-primary" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find answers to commonly asked questions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-border last:border-0 pb-3 last:pb-0">
                  <button
                    className="flex justify-between items-center w-full text-left py-2"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="font-medium">{item.question}</span>
                    {item.isOpen ? (
                      <ChevronUp size={18} className="text-muted-foreground" />
                    ) : (
                      <ChevronDown size={18} className="text-muted-foreground" />
                    )}
                  </button>
                  
                  {item.isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm text-muted-foreground pb-2"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
          
          {showContactForm ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Mail size={18} className="mr-2 text-bharose-primary" />
                  Contact Support
                </CardTitle>
                <CardDescription>
                  Send us a message and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Your Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      placeholder="What's your question about?"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      placeholder="Please describe your issue in detail"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      <Send size={16} className="mr-2" />
                      Send Message
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowContactForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="flex justify-center mt-6">
              <Button 
                onClick={() => setShowContactForm(true)}
                className="flex items-center"
              >
                <HelpCircle size={16} className="mr-2" />
                Contact Support
              </Button>
            </div>
          )}
        </div>
      </motion.div>
      
      <BottomNavigation />
    </div>
  );
};

export default Help;
