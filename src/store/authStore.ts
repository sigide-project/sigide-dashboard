import { create } from 'zustand';
import type { User } from '@/types';

const STORAGE_KEY = 'sigide_admin_auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

function loadPersistedAuth(): { user: User | null; token: string | null } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as { user?: User; token?: string };
      return { user: parsed.user ?? null, token: parsed.token ?? null };
    }
  } catch {
    // ignore corrupt storage
  }
  return { user: null, token: null };
}

const persisted = loadPersistedAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: persisted.user,
  token: persisted.token,
  isAuthenticated: !!persisted.token,
  setAuth: (user, token) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    set({ user, token, isAuthenticated: true });
  },
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
