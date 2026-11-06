import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Tag } from 'lucide-react';

import { Button } from '../components/ui';
import { useLabels } from '../features/labels/useLabels';
import { useTasks } from '../features/tasks/useTasks';
import TaskListView from '../features/tasks/components/TaskListView';

export default function LabelTasks() {
  const { labelId } = useParams();
  const navigate = useNavigate();

  const { labels } = useLabels();
  const { tasks } = useTasks();

  const label = labels.find((item) => item.id === labelId);

  if (!label) {
    return (
      <div className='mx-auto flex max-w-5xl flex-col items-center py-16 text-center'>
        <Tag size={32} className='mb-4 text-muted-foreground' />

        <h2 className='text-xl font-semibold text-foreground'>
          Label not found
        </h2>

        <p className='mt-2 text-sm text-muted-foreground'>
          This label may have been deleted or no longer exists.
        </p>

        <Button
          variant='secondary'
          className='mt-5'
          onClick={() => navigate('/labels')}
        >
          <ArrowLeft size={16} />
          Back to labels
        </Button>
      </div>
    );
  }

  const filteredTasks = tasks.filter((task) =>
    (task.labelIds ?? []).includes(label.id),
  );

  return (
    <div className='mx-auto w-full max-w-5xl space-y-6'>
      <button
        type='button'
        onClick={() => navigate('/labels')}
        className='inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground'
      >
        <ArrowLeft size={16} />
        Back to labels
      </button>

      <TaskListView
        headerContent={
          <div className='flex min-w-0 items-center gap-3'>
            <span
              className='flex size-11 shrink-0 items-center justify-center rounded-xl'
              style={{
                backgroundColor: `${label.color}20`,
                color: label.color,
              }}
            >
              <Tag size={21} />
            </span>

            <div className='min-w-0'>
              <h2 className='text-2xl font-semibold tracking-tight text-foreground'>
                {label.name}
              </h2>

              <p className='mt-1 text-sm text-muted-foreground'>
                Tasks assigned to this label.
              </p>
            </div>
          </div>
        }
        tasks={filteredTasks}
        emptyTitle='No tasks with this label'
        emptyDescription='Assign this label to a task to see it here.'
      />
    </div>
  );
}
