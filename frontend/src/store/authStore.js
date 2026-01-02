import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    isLoggedIn: true,
    login: () => set({ isLoggedIn: true }),
    logout: () => set({ isLoggedIn: false }),
}));