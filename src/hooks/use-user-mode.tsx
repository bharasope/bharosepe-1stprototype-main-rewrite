
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserMode = 'Buyer' | 'Seller';

interface UserModeStore {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
}

export const useUserMode = create<UserModeStore>()(
  persist(
    (set) => ({
      mode: 'Buyer',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'bharose-user-mode',
    }
  )
);
