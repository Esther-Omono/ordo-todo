import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({ trigger, children, align = 'left' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div ref={dropdownRef} className='relative inline-block'>
      <button
        type='button'
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className='inline-flex items-center gap-2 rounded-md text-sm'
      >
        {trigger || <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div
          className={`
            absolute top-full z-40 mt-2 min-w-44
            rounded-lg border border-border bg-surface
            p-1 shadow-md
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
          onClick={(event) => {
            if (event.target.closest('button')) {
              setIsOpen(false);
            }
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
