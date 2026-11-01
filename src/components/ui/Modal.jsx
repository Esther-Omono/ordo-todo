import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) {
  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/40 p-4 backdrop-blur-sm
      '
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-title'
        className={`
          w-full ${widths[size]} max-h-[90vh]
          overflow-y-auto rounded-xl border border-border
          bg-surface shadow-xl
        `}
      >
        <header className='flex items-center justify-between border-b border-border px-5 py-4'>
          <h2
            id='modal-title'
            className='text-lg font-semibold text-foreground'
          >
            {title}
          </h2>

          <button
            type='button'
            onClick={onClose}
            aria-label='Close modal'
            className='rounded-md p-2 text-muted-foreground hover:bg-surface-hover hover:text-foreground'
          >
            <X size={18} />
          </button>
        </header>

        <div className='p-5'>{children}</div>

        {footer && (
          <footer className='flex justify-end gap-2 border-t border-border px-5 py-4'>
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
}
