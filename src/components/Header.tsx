import React, { useState, useEffect, useCallback } from 'react';

import { CreateBoardModal } from './CreateBoardModal';
import { useAuthStore } from '../store/authStore';
import { useBoardStore } from '../store/boardStore';
import type { IBoard } from '../types/board';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showMyBoards, setShowMyBoards] = useState(true);
  const [showOtherBoards, setShowOtherBoards] = useState(true);


  const { user, resetUser } = useAuthStore();
  const { 
    boards, 
    currentBoard, 
    setCurrentBoard, 
    fetchPublicStickyNotes,
    fetchUserBoards, 
    fetchAllBoards,
    isLoading 
  } = useBoardStore();

  const myBoards = boards.filter(board => board.userId === user?.id);
  const otherBoards = boards.filter(board => board.userId !== user?.id);

  const handleBoardSelect = useCallback((board: IBoard) => {
    setCurrentBoard(board);
    fetchPublicStickyNotes(board.id);
    setIsMenuOpen(false);
  }, [setCurrentBoard, fetchPublicStickyNotes]);

  const handleFetchAllBoards = useCallback(async () => {
    await fetchUserBoards();
    await fetchAllBoards();
  }, [fetchUserBoards, fetchAllBoards]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    resetUser()
  }, [resetUser]);

  const handleLogin = useCallback(() => {
    
  }, []);


  useEffect(() => {
    console.log('Fetching boards...');    
    fetchAllBoards();
  }, []); // 

  console.log(user);
  

  return (
    <>
      <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Логотип и текущая доска */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-800" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Sticky Boards</h1>
                {currentBoard && (
                  <p className="text-amber-100 text-sm">Текущая доска: {currentBoard.title}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-amber-100 text-sm mr-2">
                {user?.firstName}
              </div>

              {/* Кнопка создания доски */}
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                disabled={isLoading}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Новая доска</span>
              </button>

              {/* Выпадающее меню досок */}
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                disabled={isLoading}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Список досок</span>
              </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-50 border border-amber-200">
                    {/* Заголовок и управление */}
                    <div className="px-4 py-2 border-b border-amber-100">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-amber-800">Доски</h3>
                        <button
                          onClick={handleFetchAllBoards}
                          className="text-xs text-amber-600 hover:text-amber-800"
                        >
                          Обновить
                        </button>
                      </div>
                      
                      {/* Фильтры */}
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            checked={showMyBoards}
                            onChange={(e) => setShowMyBoards(e.target.checked)}
                            className="rounded text-amber-600" 
                          />
                          <span className="text-sm text-gray-700">Мои доски ({myBoards.length})</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            checked={showOtherBoards}
                            onChange={(e) => setShowOtherBoards(e.target.checked)}
                            className="rounded text-amber-600" 
                          />
                          <span className="text-sm text-gray-700">Чужие доски ({otherBoards.length})</span>
                        </label>
                      </div>
                    </div>

                    {/* Список досок */}
                    <div className="max-h-60 overflow-y-auto">
                      {showMyBoards && myBoards.length > 0 && (
                        <div className="px-4 py-2">
                          <h4 className="text-xs font-semibold text-amber-600 mb-2 uppercase tracking-wide">Мои доски</h4>
                          <div className="space-y-1">
                            {myBoards.map(board => (
                              <button
                                key={board.id}
                                onClick={() => handleBoardSelect(board)}
                                className={`w-full text-left text-sm rounded px-2 py-1 transition-colors ${
                                  currentBoard?.id === board.id 
                                    ? 'bg-amber-100 text-amber-800' 
                                    : 'text-gray-700 hover:bg-amber-50'
                                }`}
                              >
                                <div className="font-medium">{board.title}</div>
                                {board.description && (
                                  <div className="text-xs text-gray-500 truncate">{board.description}</div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {showOtherBoards && otherBoards.length > 0 && (
                        <div className="px-4 py-2 border-t border-amber-100">
                          <h4 className="text-xs font-semibold text-purple-600 mb-2 uppercase tracking-wide">Чужие доски</h4>
                          <div className="space-y-1">
                            {otherBoards.map(board => (
                              <button
                                key={board.id}
                                onClick={() => handleBoardSelect(board)}
                                className={`w-full text-left text-sm rounded px-2 py-1 transition-colors ${
                                  currentBoard?.id === board.id 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'text-gray-700 hover:bg-purple-50'
                                }`}
                              >
                                <div className="font-medium">{board.title}</div>
                                {board.description && (
                                  <div className="text-xs text-gray-500 truncate">{board.description}</div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {(boards.length === 0) && (
                        <div className="px-4 py-4 text-center text-gray-500 text-sm">
                          Нет доступных досок
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Кнопка выхода */}
              {user ? 
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-amber-500 rounded-lg transition-colors duration-200"
                title="Выйти"
              >
                Выйти
              </button> : 
                 <button 
                onClick={handleLogin}
                className="p-2 hover:bg-amber-500 rounded-lg transition-colors duration-200"
                title="Выйти"
              >
                Войти
              </button>
              }

            </div>
          </div>
        </div>
      </header>

      <CreateBoardModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};
