import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
    persist(
        (set) => ({
            mode: 'light',

            // Switch between light and dark
            toggleMode: () =>
                set((state) => ({
                    mode: state.mode === 'light' ? 'dark' : 'light',
                })),
        }),
        {
            name: 'theme-storage', // localStorage key
        }
    )
);