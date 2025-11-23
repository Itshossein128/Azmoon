import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../../shared/types';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'user-storage', // name of the item in the storage (localStorage by default)
    },
  ),
);
