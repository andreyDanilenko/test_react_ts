// src/components/Sticker.tsx
import React from 'react';

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

  console.log(isOwnedByUser);
  

  return (
    <div
      className={`absolute border-2 rounded-xl shadow-md p-4 w-40 min-h-48 flex flex-col justify-between transform transition-transform duration-200 hover:shadow-lg ${
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
        
        {/* Показываем иконки управления только для своих стикеров */}
        {isOwnedByUser && (
          <div className="flex gap-1">
            <button
              onClick={() => onEdit?.(id)}
              className="p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors"
              title="Edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                viewBox="0 0 16 16"
                style={{ color: textColor }}
              >
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete?.(id)}
              className="p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors"
              title="Delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                viewBox="0 0 16 16"
                style={{ color: textColor }}
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
