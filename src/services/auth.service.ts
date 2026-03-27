import { api } from ".";
import { REFRESH_TOKEN_KEY } from "../types";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
}

interface RefreshResponse {
  accessToken: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post("/api/auth/login", { username, password });
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    return data;
  },

  register: async (username: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post("/api/auth/register", { username, password });
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    return data;
  },

  refresh: async (): Promise<RefreshResponse> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) throw new Error("No refresh token found");
    const { data } = await api.post("/api/auth/refresh", { refreshToken });
    return data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return;
    try {
      await api.post("/auth/logout", { refreshToken });
    } catch {
    } finally {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
};