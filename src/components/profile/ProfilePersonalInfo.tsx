
import React from 'react';
import { User, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  name: string;
  phone: string;
  email: string;
  bio: string;
  location: string;
  businessHours: string;
}

interface ProfilePersonalInfoProps {
  formData: FormData;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfilePersonalInfo: React.FC<ProfilePersonalInfoProps> = ({
  formData,
  isEditing,
  handleInputChange
}) => {
  return (
    <div className="bharose-card">
      <h3 className="font-medium mb-4">Personal Information</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <div className="flex items-center border rounded-md">
            <div className="px-3 py-2 text-muted-foreground">
              <User size={18} />
            </div>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border-0"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex items-center border rounded-md">
            <div className="px-3 py-2 text-muted-foreground">
              <Phone size={18} />
            </div>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border-0"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="email">Email Address</Label>
          <div className="flex items-center border rounded-md">
            <div className="px-3 py-2 text-muted-foreground">
              <Mail size={18} />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border-0"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Input
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Tell others about yourself"
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <div className="flex items-center border rounded-md">
            <div className="px-3 py-2 text-muted-foreground">
              <MapPin size={18} />
            </div>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border-0"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="businessHours">Business Hours</Label>
          <div className="flex items-center border rounded-md">
            <div className="px-3 py-2 text-muted-foreground">
              <Clock size={18} />
            </div>
            <Input
              id="businessHours"
              name="businessHours"
              value={formData.businessHours}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePersonalInfo;
