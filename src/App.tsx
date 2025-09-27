import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { AuthService } from './services/AuthService';

const App: React.FC = () => {
  useEffect(() => {
    const initializeAuth = async () => {
      const authService = new AuthService();
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          await authService.fetchCurrentUser();
        } catch (error) {
          console.error('Failed to fetch user:', error);
          authService.logout();
        }
      }
    };

    initializeAuth();
  }, []);

  return (
    <div className="h-screen flex flex-col box-sizing">
      <Header />
      <div className="flex flex-1 p-2 overflow-hidden">
        <Board />
      </div>
    </div>
  );
};

export default App;
