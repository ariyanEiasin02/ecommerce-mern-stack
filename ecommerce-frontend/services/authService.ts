import { axiosInstance } from '@/config/axiosInstance';
import Cookies from 'js-cookie';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isBlocked: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    const res = await axiosInstance.post<AuthResponse>('/auth/register', data);
    const { user, token } = res.data.data;
    Cookies.set('user_token', token, { expires: 30 });
    Cookies.set('user_role', user.role, { expires: 30 });
    Cookies.set('user_id', user._id, { expires: 30 });
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await axiosInstance.post<AuthResponse>('/auth/login', data);
    const { user, token } = res.data.data;
    Cookies.set('user_token', token, { expires: 30 });
    Cookies.set('user_role', user.role, { expires: 30 });
    Cookies.set('user_id', user._id, { expires: 30 });
    return res.data;
  },

  async logout() {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      Cookies.remove('user_token');
      Cookies.remove('user_role');
      Cookies.remove('user_id');
    }
  },

  async getMe() {
    const res = await axiosInstance.get<{ success: boolean; data: User }>('/auth/me');
    return res.data.data;
  },

  async updateProfile(data: Partial<User>) {
    const userId = Cookies.get('user_id');
    if (!userId) throw new Error('Not authenticated');
    const res = await axiosInstance.put<{ success: boolean; data: User }>(`/users/${userId}`, data);
    return res.data.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await axiosInstance.put('/auth/change-password', { currentPassword, newPassword });
    return res.data;
  },
};
