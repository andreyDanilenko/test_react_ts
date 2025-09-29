import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: number;
  className?: string;
  triggerMode?: 'hover' | 'click' | 'both';
  offset?: number;
  viewportOffset?: number;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const Tooltip: React.FC<TooltipProps> = ({
  trigger,
  children,
  position = 'bottom',
  width = 320,
  className = '',
  triggerMode = 'both',
  offset = 8,
  viewportOffset = 16,
  isOpen: externalIsOpen,
  onOpenChange,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  // Если передан внешний isOpen, используем его, иначе внутренний state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    }
    if (externalIsOpen === undefined) {
      setInternalIsOpen(value);
    }
  };

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let top = 0;
    let left = 0;

    // Базовая позиция
    switch (position) {
      case 'top':
        top = rect.top + window.scrollY - offset;
        left = rect.left + rect.width / 2 + window.scrollX;
        break;
      case 'bottom':
        top = rect.bottom + window.scrollY + offset;
        left = rect.left + rect.width / 2 + window.scrollX;
        break;
      case 'left':
        top = rect.top + rect.height / 2 + window.scrollY;
        left = rect.left + window.scrollX - offset;
        break;
      case 'right':
        top = rect.top + rect.height / 2 + window.scrollY;
        left = rect.right + window.scrollX + offset;
        break;
    }

    // Проверяем границы экрана и корректируем
    const halfWidth = width / 2;
    
    // Для top/bottom позиций проверяем горизонтальные границы
    if (position === 'top' || position === 'bottom') {
      if (left - halfWidth < viewportOffset) {
        // Упирается в левый край - сдвигаем вправо
        left = viewportOffset + halfWidth;
      } else if (left + halfWidth > viewportWidth - viewportOffset) {
        // Упирается в правый край - сдвигаем влево
        left = viewportWidth - viewportOffset - halfWidth;
      }
    }
    
    // Для left/right позиций проверяем вертикальные границы
    if (position === 'left' || position === 'right') {
      const estimatedHeight = 200; // Примерная высота тултипа
      const halfHeight = estimatedHeight / 2;
      
      if (top - halfHeight < viewportOffset) {
        // Упирается в верхний край - сдвигаем вниз
        top = viewportOffset + halfHeight;
      } else if (top + halfHeight > viewportHeight - viewportOffset) {
        // Упирается в нижний край - сдвигаем вверх
        top = viewportHeight - viewportOffset - halfHeight;
      }
    }

    setCoords({ top, left });
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
        document.removeEventListener('mousedown', handleClickOutside);
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }
      };
    }
  }, [isOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      tooltipRef.current && 
      !tooltipRef.current.contains(event.target as Node) &&
      triggerRef.current &&
      !triggerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleTriggerClick = () => {
    if (triggerMode === 'click' || triggerMode === 'both') {
      setIsOpen(!isOpen);
    }
  };

  const handleTriggerMouseEnter = () => {
    if (triggerMode === 'hover' || triggerMode === 'both') {
      // Отменяем закрытие если курсор вернулся
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      setIsOpen(true);
    }
  };

  const handleTriggerMouseLeave = () => {
    if (triggerMode === 'hover' || triggerMode === 'both') {
      // Добавляем небольшую задержку перед закрытием
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 100); // 100ms задержка для перехода на тултип
    }
  };

  const handleTooltipMouseEnter = () => {
    // Отменяем закрытие когда курсор на тултипе
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  const handleTooltipMouseLeave = () => {
    if (triggerMode === 'hover' || triggerMode === 'both') {
      // Закрываем когда курсор ушел с тултипа
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 100);
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleTriggerMouseEnter}
        onMouseLeave={handleTriggerMouseLeave}
        onClick={handleTriggerClick}
        className="inline-block"
      >
        {trigger}
      </div>

      {isOpen && createPortal(
        <div
          ref={tooltipRef}
          className={`fixed z-50 animate-in fade-in-0 zoom-in-95 ${className}`}
          style={{
            top: coords.top,
            left: coords.left,
            transform: getTransform(position),
            width: width
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          <div className="bg-white rounded-lg shadow-xl border border-amber-200 p-0 overflow-hidden">
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

const getTransform = (position: string) => {
  switch (position) {
    case 'top': return 'translateX(-50%) translateY(-100%)';
    case 'bottom': return 'translateX(-50%)';
    case 'left': return 'translateX(-100%) translateY(-50%)';
    case 'right': return 'translateY(-50%)';
    default: return 'translateX(-50%)';
  }
};
