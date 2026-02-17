import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

export interface User {
  id: string | number;
  name: string;
  email: string;
  email_verified_at?: string;
  is_sub?: boolean;
  roles?: {
    name: string;
    super_admin: boolean;
    home_page: string;
    permissions?: { slug: string }[];
  }[];
  latest_subscription_plan?: any;
  subscriptions?: any[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  mainUser: { user: User | null; token: string | null } | null; // For "Act As"
  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  setActingAs: (user: User, token: string) => void;
  removeActingAs: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      mainUser: null,

      setAuth: (user, token) => {
        set({ user, token });
        Cookies.set('auth_token', token, { expires: 7 });
      },

      setUser: (user) => set({ user }),

      clearAuth: () => {
        set({ user: null, token: null, mainUser: null });
        Cookies.remove('auth_token');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
      },

      setActingAs: (newUser, newToken) => {
        const current = { user: get().user, token: get().token };
        set({
          mainUser: current,
          user: newUser,
          token: newToken
        });
        Cookies.set('auth_token', newToken, { expires: 1 });
      },

      removeActingAs: () => {
        const original = get().mainUser;
        if (original) {
          set({
            user: original.user,
            token: original.token,
            mainUser: null
          });
          if (original.token) {
            Cookies.set('auth_token', original.token, { expires: 7 });
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token, mainUser: state.mainUser }),
    }
  )
);
