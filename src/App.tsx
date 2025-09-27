import React from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';

const App: React.FC = () => {
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
