import React from 'react';
import { IconButton } from './uikit/BaseButton';
import { EditIcon } from '../assets/icons/EditIcon';
import { DeleteIcon } from '../assets/icons/DeleteIcon';

interface StickerProps {
  id: string;
  title: string;
  content?: string;
  createdAt: string | Date;
  color?: string;
  positionX?: number;
  positionY?: number;
  isOwnedByUser?: boolean; // Новый пропс
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const getContrastColor = (hexColor: string): string => {
  const color = hexColor.replace('#', '');
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#374151' : '#f9fafb';
};

const getDarkerColor = (hexColor: string, factor: number = 0.8): string => {
  const color = hexColor.replace('#', '');
  const r = Math.floor(parseInt(color.substr(0, 2), 16) * factor);
  const g = Math.floor(parseInt(color.substr(2, 2), 16) * factor);
  const b = Math.floor(parseInt(color.substr(4, 2), 16) * factor);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const Sticker: React.FC<StickerProps> = ({
  id,
  title,
  content,
  createdAt,
  color = '#faafff',
  positionX = 50,
  positionY = 50,
  isOwnedByUser = true, 
  onEdit,
  onDelete,
}) => {
  const formattedTime = new Date(createdAt).toLocaleTimeString();
  const textColor = getContrastColor(color);
  const borderColor = getDarkerColor(color, 0.9);
  

  return (
    <div
      className={`absolute border-2 rounded-xl shadow-md p-4 w-40 min-h-28 flex flex-col justify-between transform transition-transform duration-200 hover:shadow-lg ${
        isOwnedByUser ? 'cursor-move' : 'cursor-not-allowed opacity-80'
      }`}
      data-id={id}
      style={{
        backgroundColor: color,
        borderColor: borderColor,
        color: textColor,
        left: `${positionX}px`,
        top: `${positionY}px`,
      }}
    >
      <div className="font-medium text-sm mb-2 truncate">{title}</div>
      <div className="text-sm flex-1 overflow-auto opacity-90">{content || ''}</div>
      <div className="flex justify-between items-center text-xs mt-2 opacity-80">
        <span>{formattedTime}</span>
        
        {isOwnedByUser && (
          <div className="flex gap-1">
            <IconButton
              onClick={() => onEdit?.(id)}
              icon={<EditIcon />}
              title="Edit"
              color="blue"
              size="sm"
            />
            <IconButton
              onClick={() => onDelete?.(id)}
              icon={<DeleteIcon />}
              title="Delete"
              color="red"
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};
