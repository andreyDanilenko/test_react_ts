import React, { useState } from 'react';

import { BaseModal } from './BaseModal';
import { useBoardStore } from '../../store/boardStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../uikit/BaseButton';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { createBoard, isLoading } = useBoardStore();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && user) {
      await createBoard({
        title: title.trim(),
        description: description.trim() || undefined,
        userId: user.id
      });
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose}
      modalClassName="p-6 w-96 mx-4"
    >
      <h2 className="text-xl font-bold mb-4 text-amber-800">Создать новую доску</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название доски *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Введите название доски"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Описание
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Описание доски"
            rows={3}
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
            <Button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                color="gray"
                size="md"
            >
                Отмена
            </Button>
            <Button
                type="submit"
                disabled={isLoading || !user || !title.trim()}
                color="orange"
                size="md"
                isLoading={isLoading}
            >
                Создать доску
            </Button>
        </div>
      </form>
    </BaseModal>
  );
};
