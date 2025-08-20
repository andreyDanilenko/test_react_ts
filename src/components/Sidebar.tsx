import React, { useEffect, useState } from 'react';
import { BoardService } from '../services/BoardService';
import type { IBoardSanitized } from '../types/board';

const boardService = new BoardService();

export const Sidebar: React.FC = () => {
  const [boards, setBoards] = useState<IBoardSanitized[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setLoading(true);
        const data = await boardService.getAllBoards();
        setBoards(data);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить доски');
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  if (loading) return <aside className="w-64 bg-gray-100 p-4 border-r border-gray-300">Загрузка...</aside>;
  if (error) return <aside className="w-64 bg-gray-100 p-4 border-r border-gray-300">{error}</aside>;

  return (
    <aside className="w-64 bg-gray-100 p-4 border-r border-gray-300">
      <h2 className="font-semibold mb-4">Доски</h2>
      <ul className="flex flex-col gap-2">
        {boards.map((board) => (
          <li
            key={board.id}
            className="p-2 bg-white rounded shadow hover:bg-gray-50 cursor-pointer"
          >
            {board.title}
          </li>
        ))}
      </ul>
    </aside>
  );
};
