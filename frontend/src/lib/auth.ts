"use client";

import { User } from '@/lib/types';
import apiClient from '@/lib/axios';

export class AuthService {
  private static readonly USER_KEY = 'pos_user';
  private static readonly TOKEN_KEY = 'authToken';

  static async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { user, token } = response.data.data;
      console.log(token, user);

      if (user && token) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        localStorage.setItem(this.TOKEN_KEY, token);
        return user as User;
      }

      return null;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  }

  static logout(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static hasRole(role: 'ADMIN' | 'CASHIER'): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}
