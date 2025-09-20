
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TestProfile {
  id: string;
  name: string;
  role: 'Seller' | 'Buyer';
  phone: string;
  email: string;
  avatar?: string;
}

interface ProfileManagerStore {
  currentProfile: TestProfile;
  profiles: TestProfile[];
  setCurrentProfile: (profile: TestProfile) => void;
  getOtherProfile: () => TestProfile;
}

// ONLY 2 profiles - Rahul (Seller) and Amit (Buyer)
const FIXED_PROFILES: TestProfile[] = [
  {
    id: 'rahul-seller',
    name: 'Rahul Kumar',
    role: 'Seller',
    phone: '9999990001',
    email: 'rahul@example.com',
  },
  {
    id: 'amit-buyer',
    name: 'Amit Singh',
    role: 'Buyer',
    phone: '9876543210',
    email: 'amit@example.com',
  }
];

export const useProfileManager = create<ProfileManagerStore>()(
  persist(
    (set, get) => ({
      currentProfile: FIXED_PROFILES[0], // Default to Rahul (Seller)
      profiles: FIXED_PROFILES, // Always return the fixed 2 profiles
      setCurrentProfile: (profile) => {
        // Only allow switching between the 2 fixed profiles
        const validProfile = FIXED_PROFILES.find(p => p.id === profile.id);
        if (validProfile) {
          console.log('Switching to profile:', validProfile.name, validProfile.role);
          set({ currentProfile: validProfile });
        }
      },
      getOtherProfile: () => {
        const current = get().currentProfile;
        const other = FIXED_PROFILES.find(p => p.id !== current.id);
        console.log('Other profile:', other?.name, other?.role);
        return other || FIXED_PROFILES[0];
      },
    }),
    {
      name: 'bharose-profile-manager',
      // Reset the stored state to ensure we only have 2 profiles
      version: 1,
    }
  )
);
