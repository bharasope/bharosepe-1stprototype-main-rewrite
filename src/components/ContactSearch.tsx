
import React from 'react';
import { Users, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactInfo } from '@/pages/TransactionSetup';
import { useProfileManager } from '@/hooks/use-profile-manager';

interface ContactSearchProps {
  selectedContact: ContactInfo | null;
  onContactSelect: (contact: ContactInfo) => void;
}

const ContactSearch: React.FC<ContactSearchProps> = ({
  selectedContact,
  onContactSelect
}) => {
  const { getOtherProfile } = useProfileManager();

  // Get the other profile - always just one other profile
  const otherProfile = getOtherProfile();

  if (selectedContact) {
    return (
      <div className="bharose-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-bharose-primary/10 rounded-full flex items-center justify-center mr-3">
              <Users className="h-6 w-6 text-bharose-primary" />
            </div>
            <div>
              <h3 className="font-medium">{selectedContact.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedContact.phone}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onContactSelect(null)}
          >
            Change
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Select Contact</h3>
      <div
        onClick={() => onContactSelect(otherProfile)}
        className="p-4 border border-bharose-primary bg-bharose-primary/5 rounded-lg cursor-pointer hover:bg-bharose-primary/10 flex items-center"
      >
        <div className="w-12 h-12 bg-bharose-primary/20 rounded-full flex items-center justify-center mr-4">
          <Phone className="h-5 w-5 text-bharose-primary" />
        </div>
        <div>
          <p className="font-medium">{otherProfile.name}</p>
          <p className="text-sm text-muted-foreground">{otherProfile.phone}</p>
          <p className="text-xs text-bharose-primary">Test Profile - {otherProfile.role}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactSearch;
