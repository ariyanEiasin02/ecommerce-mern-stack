import { axiosInstance } from '@/config/axiosInstance';
import Cookies from 'js-cookie';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superAdmin';
  avatar?: string;
  isBlocked?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    const res = await axiosInstance.post<AuthResponse>('/auth/register', data);
    const { user, token } = res.data;
    Cookies.set('user_token', token, { expires: 30 });
    Cookies.set('user_role', user.role, { expires: 30 });
    Cookies.set('user_id', user.id, { expires: 30 });
    return { ...res.data, user: { ...user, _id: user.id } as User };
  },

  async login(data: { email: string; password: string }) {
    const res = await axiosInstance.post<AuthResponse>('/auth/login', data);
    const { user, token } = res.data;
    Cookies.set('user_token', token, { expires: 30 });
    Cookies.set('user_role', user.role, { expires: 30 });
    Cookies.set('user_id', user.id, { expires: 30 });
    return { ...res.data, user: { ...user, _id: user.id } as User };
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
    const res = await axiosInstance.get<{ success: boolean; user: any }>('/auth/me');
    const u = res.data.user;
    return { ...u, _id: u.id || u._id } as User;
  },

  async updateProfile(data: Partial<User>) {
    const userId = Cookies.get('user_id');
    if (!userId) throw new Error('Not authenticated');
    const res = await axiosInstance.put<{ success: boolean; user: any }>(`/users/${userId}`, data);
    const u = res.data.user;
    return { ...u, _id: u.id || u._id } as User;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await axiosInstance.put('/auth/change-password', { currentPassword, newPassword });
    return res.data;
  },
};
