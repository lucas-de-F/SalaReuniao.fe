// services/jwtService.ts

import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp?: number;
  userId?: string;
};

const JWT_KEY = "key";

export const jwtService = {
  getToken(): string | null {
    return localStorage.getItem(JWT_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(JWT_KEY, token);
  },

  removeToken() {
    localStorage.removeItem(JWT_KEY);
  },

  isValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp || decoded.exp * 1000 < Date.now()) return false;
      if (!decoded.userId) return false;
      return true;
    } catch (err) {
      console.error("Token inválido", err);
      return false;
    }
  },

  getDecoded(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  },
};
