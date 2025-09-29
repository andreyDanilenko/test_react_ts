import React, { useRef, useCallback, memo, useState, useEffect } from 'react';
import { Sticker } from './Sticker';
import { useBoardStore } from '../store/boardStore';
import { useAuthStore } from '../store/authStore';

export const Board: React.FC = memo(() => {
  const boardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingNoteRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [isDraggingBoard, setIsDraggingBoard] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

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

  const handleBoardMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    setIsDraggingBoard(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setStartY(e.pageY - containerRef.current.offsetTop);
    setScrollLeft(containerRef.current.scrollLeft);
    setScrollTop(containerRef.current.scrollTop);
  }, []);

  const handleBoardMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingBoard || !containerRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = (x - startX) * 1;
    const walkY = (y - startY) * 1;
    
    containerRef.current.scrollLeft = scrollLeft - walkX;
    containerRef.current.scrollTop = scrollTop - walkY;
  }, [isDraggingBoard, startX, startY, scrollLeft, scrollTop]);

  const handleBoardMouseUp = useCallback(() => {
    setIsDraggingBoard(false);
  }, []);

  useEffect(() => {
    if (isDraggingBoard) {
      window.addEventListener('mousemove', handleBoardMouseMove);
      window.addEventListener('mouseup', handleBoardMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleBoardMouseMove);
        window.removeEventListener('mouseup', handleBoardMouseUp);
      };
    }
  }, [isDraggingBoard, handleBoardMouseMove, handleBoardMouseUp]);

  const handleMouseDown = useCallback((e: React.MouseEvent, stickyId: string, positionX: number, positionY: number) => {
    if (!isBoardOwnedByUser) return;

    e.stopPropagation();
    
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

      const boundedX = Math.max(0, Math.min(e.clientX - offsetX, 2000));
      const boundedY = Math.max(0, Math.min(e.clientY - offsetY, 2000));

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
      className="relative flex-1 bg-amber-50 border-2 border-amber-200 rounded-2xl shadow-lg overflow-hidden"
      style={{ maxHeight: '100vh' }}
    >
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto cursor-grab active:cursor-grabbing"
        onMouseDown={handleBoardMouseDown}
        style={{
          overscrollBehavior: 'none'
        }}
      >
        <div
          ref={boardRef}
          className="relative bg-amber-50"
          style={{ 
            width: '2000px', 
            height: '2000px',
            backgroundImage: `
              linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        >
          <div className="absolute top-4 left-4 w-3 h-3 bg-amber-300 rounded-full opacity-60"></div>
          <div className="absolute top-4 right-4 w-3 h-3 bg-amber-300 rounded-full opacity-60"></div>
          <div className="absolute bottom-4 left-4 w-3 h-3 bg-amber-300 rounded-full opacity-60"></div>
          <div className="absolute bottom-4 right-4 w-3 h-3 bg-amber-300 rounded-full opacity-60"></div>
          
          {stickers.map(sticky => {
            const handlers = createStickyHandlers(sticky.id);
            
            return (
              <div 
                key={sticky.id} 
                onMouseDown={handlers.onMouseDown}
                style={{
                  position: 'absolute',
                  left: sticky.positionX,
                  top: sticky.positionY,
                }}
              >
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
        </div>
      </div>
    </main>
  );
});

Board.displayName = 'Board';
