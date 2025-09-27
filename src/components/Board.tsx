import React, { useEffect, useRef } from 'react';
import { Sticker } from './Sticker';
import { useBoardStore } from '../store/boardStore';
import { useAuthStore } from '../store/authStore'; // Добавляем импорт authStore

export const Board: React.FC = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const draggingNoteRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  
  const { 
    currentBoard, 
    stickyNotes, 
    moveStickyNote,
    updateStickyNote,
    deleteStickyNote 
  } = useBoardStore();

  useEffect(() =>{
    console.log(stickyNotes);
    
  }, [stickyNotes])

  const { user } = useAuthStore(); // Получаем текущего пользователя

  const handleMouseDown = (e: React.MouseEvent, stickyId: string, positionX: number, positionY: number, stickyUserId: string) => {
    // Проверяем, принадлежит ли стикер текущему пользователю
    console.log(user, positionX, positionY);
    
    // if (!user || stickyUserId !== user.id) {
    //   return; // Запрещаем перетаскивание чужого стикера
    // }

    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    draggingNoteRef.current = {
      id: stickyId,
      offsetX: e.clientX - positionX,
      offsetY: e.clientY - positionY,
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingNoteRef.current || !currentBoard) return;

    const { id, offsetX, offsetY } = draggingNoteRef.current;
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    // Ограничиваем перемещение в пределах доски
    const boundedX = Math.max(0, Math.min(e.clientX - offsetX, boardRect.width - 160));
    const boundedY = Math.max(0, Math.min(e.clientY - offsetY, boardRect.height - 192));


    console.log('boundedX', boundedX, boundedY);
    
    // Обновляем позицию через store
    // moveStickyNote(id, currentBoard.id, boundedX, boundedY);
  };

  const handleMouseUp = () => {
    draggingNoteRef.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleEditSticky = (stickyId: string, stickyUserId: string, updates: { title?: string; content?: string; color?: string }) => {
    // Проверяем, принадлежит ли стикер текущему пользователю

    console.log('update');
    
    // if (!user || stickyUserId !== user.id) {
    //   alert('Вы не можете редактировать чужой стикер');
    //   return;
    // }
    updateStickyNote(stickyId, updates);
  };

  const handleDeleteSticky = (stickyId: string, stickyUserId: string) => {
    // Проверяем, принадлежит ли стикер текущему пользователю
    if (!user || stickyUserId !== user.id) {
      alert('Вы не можете удалить чужой стикер');
      return;
    }

    if (window.confirm('Удалить этот стикер?')) {
      deleteStickyNote(stickyId);
    }
  };

  // Если нет текущей доски, показываем заглушку
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
      {/* Декоративные элементы доски */}
      <div className="absolute top-4 left-4 w-3 h-3 bg-amber-300 rounded-full opacity-60"></div>
      <div className="absolute top-4 right-4 w-3 h-3 bg-amber-300 rounded-full opacity-60"></div>
      <div className="absolute bottom-4 left-4 w-3 h-3 bg-amber-300 rounded-full opacity-60"></div>
      <div className="absolute bottom-4 right-4 w-3 h-3 bg-amber-300 rounded-full opacity-60"></div>
      
      {/* Сетка для визуального разделения */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-amber-300 h-full"></div>
          ))}
        </div>
      </div>
      
      {/* Используем стикеры из store */}
      {stickyNotes.map(sticky => (
        <div
          key={sticky.id}
          onMouseDown={e => handleMouseDown(e, sticky.id, sticky.positionX, sticky.positionY, sticky.userId)}
        >
          <Sticker
            id={sticky.id}
            title={sticky.title}
            content={sticky.content}
            color={sticky.color}
            positionX={sticky.positionX}
            positionY={sticky.positionY}
            createdAt={sticky.createdAt}
            isOwnedByUser={user?.id === sticky.userId} // Передаем информацию о принадлежности
            onEdit={() => {
              const newTitle = prompt('Новое название:', sticky.title);
              if (newTitle) {
                handleEditSticky(sticky.id, sticky.userId, { title: newTitle });
              }
            }}
            onDelete={() => handleDeleteSticky(sticky.id, sticky.userId)}
          />
        </div>
      ))}
    </main>
  );
};
