'use client';
import React, { useEffect, useRef } from 'react';

type ModalBaseProps = {
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
};

export default function ModalBase({ children, onClose, isOpen }: ModalBaseProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
        onClose();
    }
  };


  return (
    <dialog ref={dialogRef} onKeyDown={handleKeyDown} onClose={onClose}>
      {children}
    </dialog>
  );
}