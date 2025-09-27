import { BaseApiService } from './BaseApiService';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../config/apiConfig';
import type { User } from '../types/user';

interface LoginResponse {
    data: {
        token: string;
        user: User;
    }
}

interface UserResponse {
    data: User;
}

export class AuthService extends BaseApiService {
  constructor() {
    super({
      baseURL: API_BASE_URL,
      getToken: () => localStorage.getItem('authToken'),
      onUnauthorized: () => {
        this.logout();
      },
      enableLogging: true,
    });
  }

  async login(email: string, password: string) {
    const data = await this.post<LoginResponse>('/auth/login', { email, password });    
    localStorage.setItem('authToken', data.data.token);
    useAuthStore.getState().setUser(data.data.user);
  }

  async fetchCurrentUser() {
    const response = await this.get<UserResponse>('/auth/me');    
    useAuthStore.getState().setUser(response.data);
    return response.data;
  }

  logout() {
    localStorage.removeItem('authToken');
    useAuthStore.getState().setUser(null);
    window.location.href = '/login';
  }

  getCurrentUser() {
    return useAuthStore.getState().user;
  }
}
