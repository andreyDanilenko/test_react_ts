import React, { useState, useCallback } from 'react';

import { useAuthStore } from '../store/authStore';
import { useBoardStore } from '../store/boardStore';
import type { IBoard } from '../types/board';
import { CreateBoardModal } from './modals/CreateBoardModal';
import { Button } from './uikit/BaseButton';
import { AuthModal } from './modals/AuthModal';
import { RegisterModal } from './modals/RegisterModal';
import { Tooltip } from './uikit/BaseTooltip';
import { BoardsTooltipContent } from './BoardsTooltipContent';

export const Header: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  
  const { user, resetUser } = useAuthStore();
  const { 
    currentBoard, 
    setCurrentBoard, 
    fetchPublicStickyNotes,
  } = useBoardStore();

  const handleBoardSelect = useCallback((board: IBoard) => {
    setCurrentBoard(board);
    fetchPublicStickyNotes(board.id);
    setIsTooltipOpen(false);
  }, [setCurrentBoard, fetchPublicStickyNotes]);

  console.log('currentBoard', currentBoard);
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    resetUser()
  }, [resetUser]);

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleSwitchToRegister = () => {
    setIsAuthModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToAuth = () => {
    setIsRegisterModalOpen(false);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
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
                <Tooltip
                  trigger={
                    <Button 
                      color="orange"
                      size="md"
                    >
                      <span>Список досок</span>
                    </Button>
                  }
                  width={320}
                  triggerMode="click"
                  offset={12}
                  position="bottom"
                  isOpen={isTooltipOpen}
                  onOpenChange={setIsTooltipOpen}
                >
                  <BoardsTooltipContent
                    currentBoard={currentBoard}
                    onBoardSelect={handleBoardSelect}
                    isOpen={isTooltipOpen}
                  />
              </Tooltip>
              <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  color="orange"
                  size="md"
                >
                  <span>Новая доска</span>
              </Button>
              {user ? 
                (<Button 
                    onClick={handleLogout}
                    variant="icon"
                    color="orange"
                    size="md"
                  >
                    Выйти
                </Button>
                    ) : (
                <Button 
                    onClick={handleOpenAuthModal}
                    variant="icon"
                    color="orange"
                    size="md"
                  >
                    Войти
                </Button>)}
            </div>
          </div>
        </div>
      </header>

      <CreateBoardModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToAuth={handleSwitchToAuth}
      />
    </>
  );
};
