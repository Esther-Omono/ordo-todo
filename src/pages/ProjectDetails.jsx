import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';

import { useProjects } from '../features/projects/useProjects';
import { useTasks } from '../features/tasks/useTasks';
import ProjectFormModal from '../features/projects/components/ProjectFormModal';
import TaskListView from '../features/tasks/components/TaskListView';

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { projects, deleteProject } = useProjects();
  const { tasks } = useTasks();

  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return (
      <main className='mx-auto max-w-5xl px-4 py-12 sm:px-6'>
        <button
          type='button'
          onClick={() => navigate('/projects')}
          className='mb-8 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-violet-600'
        >
          <ArrowLeft size={16} />
          Back to projects
        </button>

        <div className='rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-800 dark:bg-gray-900'>
          <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Project not found
          </h1>
          <p className='mt-2 text-sm text-gray-500'>
            This project may have been deleted or the link may be invalid.
          </p>
        </div>
      </main>
    );
  }

  const projectTasks = tasks.filter((task) => task.projectId === project.id);

  const completedTasks = projectTasks.filter((task) => task.completed).length;

  const totalTasks = projectTasks.length;
  const progress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const activeTasks = totalTasks - completedTasks;

  function handleDeleteProject() {
    const confirmed = window.confirm(
      `Delete "${project.name}"? Its tasks will remain in Ordo but will no longer belong to this project.`,
    );

    if (!confirmed) return;

    deleteProject(project.id);
    navigate('/projects');
  }

  return (
    <main className='mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8'>
      {/* Back navigation */}
      <button
        type='button'
        onClick={() => navigate('/projects')}
        className='mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-violet-600 dark:hover:text-violet-400'
      >
        <ArrowLeft size={16} />
        All projects
      </button>

      {/* Project header */}
      <section className='relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-7'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex min-w-0 items-start gap-4'>
            <div
              className='mt-1 h-12 w-2 shrink-0 rounded-full'
              style={{ backgroundColor: project.color }}
            />

            <div className='min-w-0'>
              <p className='mb-1 text-xs font-medium uppercase tracking-wider text-gray-400'>
                Project
              </p>

              <h1 className='wrap-break-word text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-3xl'>
                {project.name}
              </h1>

              {project.description && (
                <p className='mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400'>
                  {project.description}
                </p>
              )}
            </div>
          </div>

          {/* Project actions */}
          <div className='relative shrink-0'>
            <button
              type='button'
              onClick={() => setShowActions((current) => !current)}
              aria-label='Project actions'
              aria-expanded={showActions}
              className='rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800'
            >
              <MoreHorizontal size={20} />
            </button>

            {showActions && (
              <div className='absolute right-0 top-11 z-20 w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900'>
                <button
                  type='button'
                  onClick={() => {
                    setShowActions(false);
                    setIsEditing(true);
                  }}
                  className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                >
                  <Pencil size={15} />
                  Edit project
                </button>

                <button
                  type='button'
                  onClick={handleDeleteProject}
                  className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'
                >
                  <Trash2 size={15} />
                  Delete project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Project progress */}
        <div className='mt-8 border-t border-gray-100 pt-6 dark:border-gray-800'>
          <div className='mb-3 flex items-center justify-between gap-4'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Project progress
            </span>
            <span className='text-sm font-semibold text-gray-900 dark:text-white'>
              {progress}%
            </span>
          </div>

          <div className='h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800'>
            <div
              className='h-full rounded-full transition-all duration-300'
              style={{
                width: `${progress}%`,
                backgroundColor: project.color,
              }}
            />
          </div>
        </div>

        {/* Project statistics */}
        <div className='mt-6 grid grid-cols-3 gap-3'>
          <StatCard
            label='Total tasks'
            value={totalTasks}
            icon={<Circle size={16} />}
          />

          <StatCard
            label='Active'
            value={activeTasks}
            icon={<MoreHorizontal size={16} />}
          />

          <StatCard
            label='Completed'
            value={completedTasks}
            icon={<CheckCircle2 size={16} />}
          />
        </div>
      </section>

      {/* Project task list */}
      <section className='mt-8'>
        <div className='mb-4'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Project tasks
          </h2>
          <p className='mt-1 text-sm text-gray-500'>
            Tasks assigned to {project.name}.
          </p>
        </div>

        <TaskListView tasks={projectTasks} defaultProjectId={project.id} />
      </section>

      {/* Edit project modal */}
      {isEditing && (
        <ProjectFormModal
          isOpen={isEditing}
          project={project}
          onClose={() => setIsEditing(false)}
        />
      )}
    </main>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className='min-w-0 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60 sm:p-4'>
      <div className='mb-3 flex items-center gap-2 text-gray-400'>
        {icon}
        <span className='truncate text-xs'>{label}</span>
      </div>

      <p className='text-xl font-semibold text-gray-900 dark:text-white'>
        {value}
      </p>
    </div>
  );
}

export default ProjectDetails;
