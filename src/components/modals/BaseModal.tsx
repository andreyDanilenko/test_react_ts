import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react'

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  overlayClassName?: string;
  modalClassName?: string;
  closeOnOverlayClick?: boolean;
  animationDuration?: number;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
  overlayClassName = '',
  modalClassName = '',
  closeOnOverlayClick = true,
  animationDuration = 300,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      // Небольшая задержка для применения анимации
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Ждем завершения анимации перед размонтированием
      const timer = setTimeout(() => setIsMounted(false), animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDuration]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  if (!isMounted) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 ${overlayClassName}`}
      onClick={handleOverlayClick}
      style={{
        backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
        transition: `background-color ${animationDuration}ms ease-in-out`,
      }}
    >
      <div 
        className={`bg-white rounded-lg relative ${modalClassName}`}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
          transition: `all ${animationDuration}ms ease-in-out`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
