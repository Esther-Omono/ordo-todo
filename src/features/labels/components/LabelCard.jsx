import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, Tag } from 'lucide-react';

import { useLabels } from '../useLabels';
import { useTasks } from '../../tasks/useTasks';
import LabelFormModal from './LabelFormModal';

export default function LabelCard({ label }) {
  const { deleteLabel } = useLabels();
  const { tasks } = useTasks();

  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const labelTasks = tasks.filter((task) =>
    (task.labelIds ?? []).includes(label.id),
  );

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${label.name}"? This label will be removed from all associated tasks.`,
    );

    if (confirmed) {
      deleteLabel(label.id);
    }
  }

  return (
    <>
      <article className='group relative rounded-xl border border-border bg-surface p-5 transition hover:border-primary/40 hover:shadow-sm'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex min-w-0 items-center gap-3'>
            <span
              className='flex size-10 shrink-0 items-center justify-center rounded-xl'
              style={{
                backgroundColor: `${label.color}20`,
                color: label.color,
              }}
            >
              <Tag size={19} />
            </span>

            <div className='min-w-0'>
              <h3 className='truncate font-semibold text-foreground'>
                {label.name}
              </h3>

              <p className='mt-1 text-xs text-muted-foreground'>
                {labelTasks.length === 1
                  ? '1 task'
                  : `${labelTasks.length} tasks`}
              </p>
            </div>
          </div>

          <div className='relative'>
            <button
              type='button'
              onClick={() => setShowActions((previous) => !previous)}
              aria-label={`Actions for ${label.name}`}
              aria-expanded={showActions}
              className='rounded-lg p-2 text-muted-foreground transition hover:bg-surface-hover hover:text-foreground'
            >
              <MoreHorizontal size={19} />
            </button>

            {showActions && (
              <div className='absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-border bg-surface p-1 shadow-lg'>
                <button
                  type='button'
                  onClick={() => {
                    setIsEditing(true);
                    setShowActions(false);
                  }}
                  className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-surface-hover'
                >
                  <Pencil size={15} />
                  Edit label
                </button>

                <button
                  type='button'
                  onClick={() => {
                    setShowActions(false);
                    handleDelete();
                  }}
                  className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger hover:bg-surface-hover'
                >
                  <Trash2 size={15} />
                  Delete label
                </button>
              </div>
            )}
          </div>
        </div>

        <div className='mt-5 flex items-center justify-between'>
          <span
            className='rounded-full px-2.5 py-1 text-xs font-medium'
            style={{
              backgroundColor: `${label.color}20`,
              color: label.color,
            }}
          >
            {label.name}
          </span>

          <span className='text-xs text-muted-foreground'>
            {labelTasks.length} assigned
          </span>
        </div>
      </article>

      {isEditing && (
        <LabelFormModal
          key={label.id}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          label={label}
        />
      )}
    </>
  );
}
