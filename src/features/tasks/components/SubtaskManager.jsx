import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';

import { Button, Checkbox, Input } from '../../../components/ui';
import { useTasks } from '../useTasks';
import { getSubtaskProgress } from '../taskSelectors';

export default function SubtaskManager({ task }) {
  const { addSubtask, updateSubtask, deleteSubtask, toggleSubtaskCompletion } =
    useTasks();

  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const progress = getSubtaskProgress(task);

  function handleAdd(event) {
    event.preventDefault();

    if (!newTitle.trim()) return;

    addSubtask(task.id, newTitle);
    setNewTitle('');
  }

  function startEditing(subtask) {
    setEditingId(subtask.id);
    setEditingTitle(subtask.title);
  }

  function saveEdit(subtaskId) {
    const title = editingTitle.trim();

    if (!title) return;

    updateSubtask(task.id, subtaskId, { title });

    setEditingId(null);
    setEditingTitle('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle('');
  }

  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-foreground'>Subtasks</h3>

        <span className='text-xs text-muted-foreground'>
          {progress.completed}/{progress.total} completed
        </span>
      </div>

      {progress.total > 0 && (
        <div
          className='h-1.5 overflow-hidden rounded-full bg-surface-secondary'
          role='progressbar'
          aria-valuenow={progress.percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label='Subtask completion'
        >
          <div
            className='h-full rounded-full bg-primary transition-all duration-300'
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      )}

      <div className='space-y-2'>
        {task.subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className='group flex items-center gap-3 rounded-md px-2 py-2 hover:bg-surface-hover'
          >
            <Checkbox
              checked={subtask.completed}
              onChange={() => toggleSubtaskCompletion(task.id, subtask.id)}
            />

            {editingId === subtask.id ? (
              <form
                className='flex min-w-0 flex-1 items-center gap-2'
                onSubmit={(event) => {
                  event.preventDefault();
                  saveEdit(subtask.id);
                }}
              >
                <Input
                  value={editingTitle}
                  onChange={(event) => setEditingTitle(event.target.value)}
                  autoFocus
                  className='py-1'
                />

                <button
                  type='submit'
                  aria-label='Save subtask'
                  className='text-success'
                >
                  <Check size={17} />
                </button>

                <button
                  type='button'
                  aria-label='Cancel editing'
                  onClick={cancelEdit}
                  className='text-muted-foreground'
                >
                  <X size={17} />
                </button>
              </form>
            ) : (
              <>
                <span
                  className={`
                    min-w-0 flex-1 text-sm
                    ${
                      subtask.completed
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground'
                    }
                  `}
                >
                  {subtask.title}
                </span>

                <div className='flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'>
                  <button
                    type='button'
                    onClick={() => startEditing(subtask)}
                    aria-label={`Edit ${subtask.title}`}
                    className='text-muted-foreground hover:text-foreground'
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type='button'
                    onClick={() => deleteSubtask(task.id, subtask.id)}
                    aria-label={`Delete ${subtask.title}`}
                    className='text-muted-foreground hover:text-danger'
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className='flex items-center gap-2'>
        <Input
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          placeholder='Add a subtask...'
          aria-label='New subtask title'
        />

        <Button
          type='submit'
          size='md'
          disabled={!newTitle.trim()}
          aria-label='Add subtask'
        >
          <Plus size={17} />
          Add
        </Button>
      </form>
    </section>
  );
}
