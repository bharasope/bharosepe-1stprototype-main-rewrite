
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import ChatSystem from './ChatSystem';

interface ChatButtonProps {
  recipientName: string;
  recipientAvatar?: string;
  transactionId?: string;
  hasNewMessages?: boolean;
}

const ChatButton: React.FC<ChatButtonProps> = ({
  recipientName,
  recipientAvatar,
  transactionId,
  hasNewMessages = false
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  return (
    <>
      <motion.div 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsChatOpen(true)}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Chat</span>
        </Button>
        
        {hasNewMessages && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
          >
            !
          </Badge>
        )}
      </motion.div>
      
      <ChatSystem
        transactionId={transactionId}
        recipientName={recipientName}
        recipientAvatar={recipientAvatar}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};

export default ChatButton;
