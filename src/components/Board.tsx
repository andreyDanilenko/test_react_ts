// src/components/Board.tsx
import React, { useState, useRef } from 'react';
import { Sticker } from './Sticker';

interface Note {
  id: string;
  title: string;
  content?: string;
  color?: string;
  positionX: number;
  positionY: number;
  createdAt: string;
}

export const Board: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Стикер 1', positionX: 50, positionY: 50, createdAt: new Date().toISOString() },
    { id: '2', title: 'Стикер 2', positionX: 200, positionY: 80, createdAt: new Date().toISOString() },
    { id: '3', title: 'Стикер 3', positionX: 120, positionY: 200, createdAt: new Date().toISOString() },
  ]);

  const boardRef = useRef<HTMLDivElement>(null);
  const draggingNoteRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, note: Note) => {
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    draggingNoteRef.current = {
      id: note.id,
      offsetX: e.clientX - note.positionX,
      offsetY: e.clientY - note.positionY,
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingNoteRef.current) return;

    const { id, offsetX, offsetY } = draggingNoteRef.current;

    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, positionX: e.clientX - offsetX, positionY: e.clientY - offsetY }
          : note
      )
    );
  };

  const handleMouseUp = () => {
    draggingNoteRef.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <main
      ref={boardRef}
      className="relative flex-1 p-4 bg-gray-50 overflow-auto"
      style={{ minHeight: '100vh' }}
    >
      {notes.map(note => (
        <div
          key={note.id}
          onMouseDown={e => handleMouseDown(e, note)}
        >
          <Sticker
            id={note.id}
            title={note.title}
            content={note.content}
            color={note.color}
            positionX={note.positionX}
            positionY={note.positionY}
            createdAt={note.createdAt}
          />
        </div>
      ))}
    </main>
  );
};
