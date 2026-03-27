import { create } from "zustand";
import { authService } from "../services";
import { REFRESH_TOKEN_KEY } from "../types";

type View = "login" | "register";

interface User {
    name: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    view: View;
    isLoading: boolean;

    setView: (view: View) => void;
    setName: (name: string) => void;
    setToken: (token: string | null) => void;

    login: (username: string, password: string) => Promise<User>;
    register: (username: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
    restoreSession: () => Promise<string | null>;
}


export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    view: "login",
    isLoading: true,

    setView: (view) => set({ view }),

    setName: (name) =>
        set((state) => ({
            user: { ...(state.user ?? {}), name },
        })),

    setToken: (token) =>
        set({
            token,
            isAuthenticated: !!token,
        }),

    login: async (username, password) => {
        const res = await authService.login(username, password);

        localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);

        const user = { name: res.username };

        set({
            user,
            token: res.accessToken,
            isAuthenticated: true,
        });

        return user;
    },

    register: async (username, password) => {
        const res = await authService.register(username, password);

        localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);

        const user = { name: res.username };

        set({
            user,
            token: res.accessToken,
            isAuthenticated: true,
        });

        return user;
    },

    logout: async () => {
        try {
            await authService.logout();
        } catch (error) {
        } finally {
            localStorage.removeItem(REFRESH_TOKEN_KEY);

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                view: "login",
            });
        }
    },
    restoreSession: async () => {
        set({ isLoading: true });
        try {
            const res = await authService.refresh();
            set({ token: res.accessToken, isAuthenticated: true, isLoading: false });
            return res.accessToken;
        } catch (error) {
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
            return null;
        }
    }
}));