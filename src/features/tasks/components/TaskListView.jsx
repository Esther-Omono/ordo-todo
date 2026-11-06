import { useState } from 'react';
import { Plus, ListTodo } from 'lucide-react';

import { Button } from '../../../components/ui';
import TaskRow from './TaskRow';
import TaskFormModal from './TaskFormModal';
import TaskDetailsDrawer from './TaskDetailsDrawer';
import { useTasks } from '../useTasks';

export default function TaskListView({
  title,
  description,
  headerContent,
  tasks,
  defaultProjectId = null,
  emptyTitle = 'No tasks yet',
  emptyDescription = 'Your tasks will appear here.',
}) {
  const { tasks: allTasks } = useTasks();

  const [isCreating, setIsCreating] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const selectedTask =
    allTasks.find((task) => task.id === selectedTaskId) ?? null;

  return (
    <>
      <div className='mx-auto w-full max-w-5xl space-y-7'>
        {/* Page heading */}
        <header className='flex items-center justify-between gap-4'>
          {headerContent ?? (
            <div className='min-w-0'>
              <h2 className='text-2xl font-semibold tracking-tight text-foreground'>
                {title}
              </h2>

              <p className='mt-1 text-sm text-muted-foreground'>
                {description}
              </p>
            </div>
          )}

          <Button onClick={() => setIsCreating(true)}>
            <Plus size={17} />
            <span className='hidden sm:inline'>Add task</span>
            <span className='sm:hidden'>Add</span>
          </Button>
        </header>

        {/* Task count */}
        <div className='flex items-center justify-between'>
          <p className='text-sm font-medium text-muted-foreground'>
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>

        {/* Task list */}
        {tasks.length > 0 ? (
          <div className='overflow-hidden rounded-xl border border-border bg-surface'>
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onOpenDetails={(selectedTask) =>
                  setSelectedTaskId(selectedTask.id)
                }
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-16 text-center'>
            <div className='mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <ListTodo size={23} />
            </div>

            <h3 className='text-base font-semibold text-foreground'>
              {emptyTitle}
            </h3>

            <p className='mt-2 max-w-sm text-sm text-muted-foreground'>
              {emptyDescription}
            </p>

            <Button
              variant='secondary'
              className='mt-5'
              onClick={() => setIsCreating(true)}
            >
              <Plus size={16} />
              Create a task
            </Button>
          </div>
        )}
      </div>

      {/* Create task */}
      {isCreating && (
        <TaskFormModal
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
          defaultProjectId={defaultProjectId}
        />
      )}

      {/* Task details */}
      <TaskDetailsDrawer
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        defaultProjectId={defaultProjectId}
      />
    </>
  );
}
