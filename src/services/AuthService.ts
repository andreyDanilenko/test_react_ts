import { BaseApiService } from './BaseApiService';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../config/apiConfig';

interface LoginResponse {
    data: {
        token: string;
        user: { id: string; name: string; email: string };
    }
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
    console.log(data);
    
    localStorage.setItem('authToken', data.data.token);
    useAuthStore.getState().setUser(data.data.user);
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
