
import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  sender: 'user' | 'other';
  message: string;
  timestamp: Date;
}

interface ChatSystemProps {
  transactionId?: string;
  recipientName: string;
  recipientAvatar?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ChatSystem: React.FC<ChatSystemProps> = ({
  transactionId,
  recipientName,
  recipientAvatar,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'other',
      message: `Hello! I'm ${recipientName}. How can I help you?`,
      timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate response after a delay
    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'other',
        message: `Thanks for your message about ${transactionId ? `transaction #${transactionId}` : 'your inquiry'}. I'll get back to you shortly.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-4 w-[320px] z-50 bg-card rounded-lg shadow-lg border overflow-hidden flex flex-col max-h-[500px]"
        >
          {/* Chat header */}
          <div className="p-3 bg-muted/50 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={recipientAvatar} alt={recipientName} />
                <AvatarFallback>{recipientName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{recipientName}</p>
                <p className="text-xs text-muted-foreground">
                  {transactionId ? `Transaction #${transactionId}` : 'New conversation'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs text-right mt-1 opacity-70">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Chat input */}
          <div className="p-3 border-t flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatSystem;
