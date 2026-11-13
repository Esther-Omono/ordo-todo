import { Search, ListTodo } from 'lucide-react';

export default function SearchResults({ tasks = [], hasQuery, onSelect }) {
  if (!hasQuery) {
    return (
      <div className='flex flex-col items-center justify-center px-6 py-12 text-center'>
        <div className='mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <Search size={22} />
        </div>

        <h3 className='text-sm font-medium text-foreground'>
          Search your tasks
        </h3>

        <p className='mt-1 text-xs text-muted-foreground'>
          Search by task title or description.
        </p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center px-6 py-12 text-center'>
        <div className='mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
          <ListTodo size={22} />
        </div>

        <h3 className='text-sm font-medium text-foreground'>No tasks found</h3>

        <p className='mt-1 text-xs text-muted-foreground'>
          Try another search term.
        </p>
      </div>
    );
  }

  return (
    <div className='max-h-[55vh] overflow-y-auto p-2'>
      {tasks.map((task) => (
        <button
          key={task.id}
          type='button'
          onClick={() => onSelect(task)}
          className='
            flex w-full flex-col gap-1 rounded-lg px-3 py-3
            text-left transition-colors
            hover:bg-muted focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-primary
          '
        >
          <span className='text-sm font-medium text-foreground'>
            {task.title}
          </span>

          {task.description && (
            <span className='line-clamp-2 text-xs text-muted-foreground'>
              {task.description}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
