import React, { useRef, useCallback, memo, useState, useEffect } from 'react';
import { Sticker } from './Sticker';
import { useBoardStore } from '../store/boardStore';
import { useAuthStore } from '../store/authStore';

export const Board: React.FC = memo(() => {
  const boardRef = useRef<HTMLDivElement>(null);
  const draggingNoteRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const { 
    currentBoard, 
    stickyNotes, 
    moveStickyNote,
    updateStickyNote,
    deleteStickyNote 
  } = useBoardStore();

  const [stickers, setStickers] = useState(stickyNotes)
  const { user } = useAuthStore();  
  const isBoardOwnedByUser = user?.id === currentBoard?.userId;  

  useEffect(() => {
    setStickers(stickyNotes)
  }, [stickyNotes])

  const handleMouseDown = useCallback((e: React.MouseEvent, stickyId: string, positionX: number, positionY: number) => {
    if (!isBoardOwnedByUser) return;
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    draggingNoteRef.current = {
      id: stickyId,
      offsetX: e.clientX - positionX,
      offsetY: e.clientY - positionY,
    };
    const moveTimeoutRef = { current: null as number | null };

    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingNoteRef.current || !currentBoard) return;

      const { id, offsetX, offsetY } = draggingNoteRef.current;
      const boardRect = boardRef.current?.getBoundingClientRect();
      if (!boardRect) return;

      const boundedX = Math.max(0, Math.min(e.clientX - offsetX, boardRect.width - 160));
      const boundedY = Math.max(0, Math.min(e.clientY - offsetY, boardRect.height - 192));

      setStickers(prevStickers => 
        prevStickers.map(sticker => {         
         if (sticker.id === stickyId) {
            return {
              ...sticker, 
              positionX: boundedX, 
              positionY: boundedY,
            }
         }

         return sticker
        })
      );
      
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
      
      moveTimeoutRef.current = window.setTimeout(() => {
        moveStickyNote(id, boundedX, boundedY);
      }, 150);
    };

    const handleMouseUp = () => {
      draggingNoteRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };    

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [isBoardOwnedByUser, currentBoard, moveStickyNote]);

  const handleEditSticky = useCallback((stickyId: string, updates: { title?: string; content?: string; color?: string }) => {
    updateStickyNote(stickyId, updates);
  }, [updateStickyNote]);

  const handleDeleteSticky = useCallback((stickyId: string) => {
      deleteStickyNote(stickyId);
  }, [deleteStickyNote]);

  const createStickyHandlers = useCallback((stickyId: string) => {
    return {
      onEdit: () => {
        const newTitle = prompt('Новое название:', 
          stickyNotes.find(s => s.id === stickyId)?.title || '');
        if (newTitle) {
          handleEditSticky(stickyId, { title: newTitle });
        }
      },
      onDelete: () => handleDeleteSticky(stickyId),
      onMouseDown: (e: React.MouseEvent) => {
        const sticky = stickyNotes.find(s => s.id === stickyId);
        if (sticky) {
          handleMouseDown(e, stickyId, sticky.positionX, sticky.positionY);
        }
      }
    };
  }, [stickyNotes, handleEditSticky, handleDeleteSticky, handleMouseDown]);

  if (!currentBoard) {
    return (
      <main
        ref={boardRef}
        className="relative flex-1 p-8 bg-amber-50 overflow-hidden border-2 border-amber-200 rounded-2xl shadow-lg flex items-center justify-center"
        style={{ maxHeight: '100vh' }}
      >
        <div className="text-amber-600 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
          </svg>
          <p className="text-lg">Выберите доску для начала работы</p>
        </div>
      </main>
    );
  }

  return (
    <main
      ref={boardRef}
      className="relative flex-1 p-8 bg-amber-50 overflow-hidden border-2 border-amber-200 rounded-2xl shadow-lg"
      style={{ maxHeight: '100vh' }}
    >
      <div className="absolute top-4 left-4 w-3 h-3 bg-amber-300 rounded-full opacity-60"></div>
      <div className="absolute top-4 right-4 w-3 h-3 bg-amber-300 rounded-full opacity-60"></div>
      <div className="absolute bottom-4 left-4 w-3 h-3 bg-amber-300 rounded-full opacity-60"></div>
      <div className="absolute bottom-4 right-4 w-3 h-3 bg-amber-300 rounded-full opacity-60"></div>
      
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-amber-300 h-full"></div>
          ))}
        </div>
      </div>
      
      {stickers.map(sticky => {
        const handlers = createStickyHandlers(sticky.id);
        
        return (
          <div key={sticky.id} onMouseDown={handlers.onMouseDown}>
            <Sticker
              id={sticky.id}
              title={sticky.title}
              content={sticky.content}
              color={sticky.color}
              positionX={sticky.positionX}
              positionY={sticky.positionY}
              createdAt={sticky.createdAt}
              isOwnedByUser={isBoardOwnedByUser}
              onEdit={handlers.onEdit}
              onDelete={handlers.onDelete}
            />
          </div>
        );
      })}
    </main>
  );
});

Board.displayName = 'Board';
