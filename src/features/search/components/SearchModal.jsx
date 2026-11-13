import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useTaskSearch } from '../hooks/useTaskSearch';
import SearchResults from './SearchResults';

export default function SearchModal({ isOpen, onClose, onSelect }) {
  const inputRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const { query, setQuery, results, clearSearch, hasQuery, resultCount } =
    useTaskSearch();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const safeActiveIndex =
    results.length > 0 && activeIndex < results.length ? activeIndex : 0;

  if (!isOpen) return null;

  function handleClose() {
    clearSearch();
    setActiveIndex(0);
    onClose();
  }

  function handleSelect(task) {
    onSelect?.(task);
    handleClose();
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleClose();
      return;
    }

    if (!hasQuery || results.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((previous) =>
        previous >= results.length - 1 ? 0 : previous + 1,
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((previous) =>
        previous <= 0 ? results.length - 1 : previous - 1,
      );
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const selectedTask = results[safeActiveIndex];

      if (selectedTask) {
        handleSelect(selectedTask);
      }
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-3 py-[8vh] backdrop-blur-sm sm:px-4 sm:py-[12vh]'
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
        aria-describedby='search-result-count'
        className='w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-2xl'
      >
        <h2 id='search-modal-title' className='sr-only'>
          Search tasks
        </h2>

        <div className='flex items-center gap-3 border-b border-border px-3 sm:px-4'>
          <Search size={20} className='shrink-0 text-muted-foreground' />

          <input
            ref={inputRef}
            type='search'
            role='combobox'
            aria-expanded={hasQuery && results.length > 0}
            aria-controls='search-results'
            aria-activedescendant={
              hasQuery && results.length > 0
                ? `search-result-${results[activeIndex]?.id}`
                : undefined
            }
            aria-label='Search tasks'
            autoComplete='off'
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder='Search your tasks...'
            className='h-14 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground'
          />
        </div>

        <div className='flex items-center justify-between px-4 pt-3'>
          <p
            id='search-result-count'
            aria-live='polite'
            className='text-xs font-medium text-muted-foreground'
          >
            {hasQuery
              ? `${resultCount} ${resultCount === 1 ? 'result' : 'results'}`
              : ''}
          </p>
        </div>

        <SearchResults
          tasks={results}
          hasQuery={hasQuery}
          onSelect={handleSelect}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
        />

        <div className='flex items-center justify-between border-t border-border px-4 py-3'>
          <p className='text-[11px] text-muted-foreground'>
            Use ↑ ↓ to navigate and Enter to open
          </p>

          <p className='text-[11px] text-muted-foreground'>Esc to close</p>
        </div>
      </section>
    </div>
  );
}
