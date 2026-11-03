import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Pencil, Trash2, ArrowUpRight } from 'lucide-react';

import { useProjects } from '../useProjects';
import { useTasks } from '../../tasks/useTasks';
import ProjectFormModal from './ProjectFormModal';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  const { deleteProject } = useProjects();
  const { tasks } = useTasks();

  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const projectTasks = tasks.filter((task) => task.projectId === project.id);

  const completedTasks = projectTasks.filter((task) => task.completed).length;

  const totalTasks = projectTasks.length;

  const progress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${project.name}"? Its tasks will remain in Ordo but become unassigned.`,
    );

    if (confirmed) {
      deleteProject(project.id);
    }
  }

  return (
    <>
      <article className='group relative rounded-xl border border-border bg-surface p-5 transition hover:border-primary/40 hover:shadow-sm'>
        <div className='flex items-start justify-between'>
          <button
            type='button'
            onClick={() => navigate(`/projects/${project.id}`)}
            className='flex min-w-0 flex-1 items-start gap-3 text-left'
          >
            <span
              className='mt-1 size-3 shrink-0 rounded-full'
              style={{ backgroundColor: project.color }}
            />

            <div className='min-w-0'>
              <h3 className='truncate font-semibold text-foreground'>
                {project.name}
              </h3>

              <p className='mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground'>
                {project.description || 'No description added.'}
              </p>
            </div>
          </button>

          <div className='relative ml-2'>
            <button
              type='button'
              onClick={() => setShowActions((previous) => !previous)}
              aria-label='Project actions'
              aria-expanded={showActions}
              className='rounded-lg p-2 text-muted-foreground hover:bg-surface-hover hover:text-foreground'
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
                  className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-surface-hover'
                >
                  <Pencil size={15} />
                  Edit project
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
                  Delete project
                </button>
              </div>
            )}
          </div>
        </div>

        <div className='mt-6 space-y-3'>
          <div className='flex items-center justify-between text-xs'>
            <span className='text-muted-foreground'>
              {completedTasks} of {totalTasks} tasks completed
            </span>

            <span className='font-medium text-foreground'>{progress}%</span>
          </div>

          <div
            className='h-1.5 overflow-hidden rounded-full bg-surface-secondary'
            role='progressbar'
            aria-label={`${project.name} completion`}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className='h-full rounded-full transition-all'
              style={{
                width: `${progress}%`,
                backgroundColor: project.color,
              }}
            />
          </div>
        </div>

        <button
          type='button'
          onClick={() => navigate(`/projects/${project.id}`)}
          className='mt-5 flex items-center gap-1 text-xs font-medium text-primary hover:underline'
        >
          View project
          <ArrowUpRight size={14} />
        </button>
      </article>

      {isEditing && (
        <ProjectFormModal
          key={project.id}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          project={project}
        />
      )}
    </>
  );
}
