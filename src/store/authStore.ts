import { create } from "zustand";
import type {
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types";
import { AuthService } from "@/services/auth.service";
import { setAccessToken } from "@/lib/axios";

export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated";

interface AuthState {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  updateProfile: (data: FormData) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "idle",

  setUser: (user) => set({ user }),

  setStatus: (status) => set({ status }),

  register: async (payload) => {
    set({ status: "loading" });
    try {
      const data = await AuthService.register(payload);
      setAccessToken(data.accessToken);
      await get().fetchMe();
    } catch (error) {
      set({ status: "unauthenticated" });
      throw error;
    }
  },

  login: async (payload) => {
    set({ status: "loading" });
    try {
      const data = await AuthService.login(payload);
      setAccessToken(data.accessToken);
      await get().fetchMe();
    } catch (error) {
      set({ status: "unauthenticated" });
      throw error;
    }
  },

  logout: async () => {
    try {
      await AuthService.logout();
    } finally {
      setAccessToken(null);
      set({ user: null, status: "unauthenticated" });
    }
  },

  fetchMe: async () => {
    set({ status: "loading" });
    try {
      const user = await AuthService.getMe();
      set({ user, status: "authenticated" });
    } catch {
      setAccessToken(null);
      set({ user: null, status: "unauthenticated" });
    }
  },

  updateProfile: async (data: FormData) => {
    set({ status: "loading" });
    try {
      const user = await AuthService.updateMe(data);
      set({ user, status: "authenticated" });
    } catch (error) {
      // Revert loading status on failure but keep authentication intact
      set({ status: "authenticated" });
      throw error;
    }
  },
}));
