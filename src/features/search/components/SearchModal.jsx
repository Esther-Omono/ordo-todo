import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

import { Button } from '../../../components/ui';
import { useTaskSearch } from '../hooks/useTaskSearch';
import SearchResults from './SearchResults';

export default function SearchModal({ isOpen, onClose, onSelect }) {
  const inputRef = useRef(null);

  const { query, setQuery, results, clearSearch, hasQuery, resultCount } =
    useTaskSearch();

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      clearSearch();
    }
  }, [isOpen, clearSearch]);

  if (!isOpen) return null;

  function handleSelect(task) {
    onSelect?.(task);
    onClose();
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role='dialog'
        aria-modal='true'
        aria-labelledby='search-modal-title'
        className='w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-2xl'
      >
        <h2 id='search-modal-title' className='sr-only'>
          Search tasks
        </h2>

        <div className='flex items-center gap-3 border-b border-border px-4'>
          <Search size={20} className='shrink-0 text-muted-foreground' />

          <input
            ref={inputRef}
            type='search'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search your tasks...'
            aria-label='Search tasks'
            className='h-14 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground'
          />

          {hasQuery && (
            <Button
              variant='ghost'
              size='sm'
              aria-label='Clear search'
              title='Clear search'
              onClick={clearSearch}
            >
              <X size={17} />
            </Button>
          )}

          <Button
            variant='ghost'
            size='sm'
            aria-label='Close search'
            title='Close search'
            onClick={onClose}
          >
            <X size={19} />
          </Button>
        </div>

        <div className='flex items-center justify-between px-4 pt-3'>
          <p className='text-xs font-medium text-muted-foreground'>
            {hasQuery
              ? `${resultCount} ${resultCount === 1 ? 'result' : 'results'}`
              : 'Search'}
          </p>
        </div>

        <SearchResults
          tasks={results}
          hasQuery={hasQuery}
          onSelect={handleSelect}
        />
      </section>
    </div>
  );
}
