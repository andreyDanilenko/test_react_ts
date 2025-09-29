import React, { useState } from 'react';
import { BaseModal } from './BaseModal';
import { AuthService } from '../../services/AuthService';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../uikit/BaseButton';
import { getAxiosErrorMessage } from '../utils/errorUtils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSwitchToRegister 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const authService = new AuthService();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      setIsLoading(true);
      setError(null);
      
      try {
        await authService.login(email.trim(), password.trim());
        const user = authService.getCurrentUser();
        setUser(user);
        setEmail('');
        setPassword('');
        onClose();
      } catch (err: unknown) {
        const errorMessage = getAxiosErrorMessage(err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={handleClose}
      modalClassName="p-6 w-96 mx-4"
    >
      <h2 className="text-xl font-bold mb-4 text-amber-800">Вход в аккаунт</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Введите ваш email"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Пароль *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Введите ваш пароль"
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            color="gray"
            size="md"
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !email.trim() || !password.trim()}
            color="orange"
            size="md"
            isLoading={isLoading}
          >
            Войти
          </Button>
        </div>

        <div className="pt-4 border-t border-amber-100">
          <p className="text-sm text-gray-600 text-center">
            Нет аккаунта?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-amber-600 hover:text-amber-700 font-medium focus:outline-none focus:underline"
              disabled={isLoading}
            >
              Зарегистрироваться
            </button>
          </p>
        </div>
      </form>
    </BaseModal>
  );
};
