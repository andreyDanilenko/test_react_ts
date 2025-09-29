import React, { useEffect } from 'react';
import { useBoardStore } from '../store/boardStore';
import { useAuthStore } from '../store/authStore';
import type { IBoard } from '../types/board';

interface BoardsTooltipContentProps {
  currentBoard?: IBoard | null;
  onBoardSelect: (board: IBoard) => void;
  isOpen?: boolean;
}

export const BoardsTooltipContent: React.FC<BoardsTooltipContentProps> = ({
  currentBoard,
  onBoardSelect,
  isOpen = false,
}) => {
  const [showMyBoards, setShowMyBoards] = React.useState(true);
  const [showOtherBoards, setShowOtherBoards] = React.useState(true);
  
  const { user } = useAuthStore();
  const { 
    boards, 
    fetchUserBoards, 
    fetchAllBoards,
    isLoading 
  } = useBoardStore();

  const myBoards = boards.filter(board => board.userId === user?.id);
  const otherBoards = boards.filter(board => board.userId !== user?.id);

  useEffect(() => {
    if (isOpen) {
      fetchAllBoards();
    }
  }, [isOpen, fetchAllBoards]);

  const handleFetchAllBoards = async () => {
    await fetchUserBoards();
    await fetchAllBoards();
  };

  return (
    <>
    { user &&  <div className="px-4 py-2 border-b border-amber-100">
       <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-amber-800">Доски</h3>
          <button
            onClick={handleFetchAllBoards}
            disabled={isLoading}
            className="text-xs text-amber-600 hover:text-amber-800 disabled:opacity-50"
          >
            Обновить
          </button>
        </div> 

        
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
      </div> }

      <div className="max-h-60 overflow-y-auto">
        {showMyBoards && myBoards.length > 0 && (
          <div className="px-4 py-2">
            <h4 className="text-xs font-semibold text-amber-600 mb-2 uppercase tracking-wide">Мои доски</h4>
            <div className="space-y-1">
              {myBoards.map(board => (
                <button
                  key={board.id}
                  onClick={() => onBoardSelect(board)}
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
            { user && <h4 className="text-xs font-semibold text-purple-600 mb-2 uppercase tracking-wide">Чужие доски</h4> }
            <div className="space-y-1">
              {otherBoards.map(board => (
                <button
                  key={board.id}
                  onClick={() => onBoardSelect(board)}
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

        {(myBoards.length === 0 && otherBoards.length === 0) && (
          <div className="px-4 py-4 text-center text-gray-500 text-sm">
            {isLoading ? 'Загрузка...' : 'Нет доступных досок'}
          </div>
        )}
      </div>
    </>
  );
};
