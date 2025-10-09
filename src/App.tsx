import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
    <Router>
      <div className="h-screen flex flex-col box-sizing">
        <Header />
        <div className="flex flex-1 p-2 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/board" replace />} />
            <Route path="/board" element={<Board />} />
            <Route path="*" element={<Navigate to="/board" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
