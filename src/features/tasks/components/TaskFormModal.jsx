import { useState } from 'react';
import { Button, Input, Modal } from '../../../components/ui';
import { useTasks } from '../useTasks';
import { useProjects } from '../../projects/useProjects';
import { usePreferences } from '../../preferences/usePreferences';
import { useLabels } from '../../labels/useLabels';
import { Plus, X } from 'lucide-react';

const getInitialFormData = (
  task,
  defaultProjectId = null,
  defaultDueDate = '',
  defaultPriority = 'medium',
) => ({
  title: task?.title ?? '',
  description: task?.description ?? '',
  projectId: task?.projectId ?? defaultProjectId ?? '',
  labelIds: task?.labelIds ?? [],
  dueDate: task?.dueDate ?? defaultDueDate,
  dueTime: task?.dueTime ?? '',
  priority: task?.priority ?? defaultPriority,
});

export default function TaskFormModal({
  isOpen,
  onClose,
  task = null,
  defaultProjectId = null,
  defaultDueDate = '',
}) {
  const { addTask, updateTask } = useTasks();
  const { projects, addProject } = useProjects();
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const { preferences } = usePreferences();
  const { labels } = useLabels();

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: '#8B5CF6',
  });

  const [projectError, setProjectError] = useState('');

  const [formData, setFormData] = useState(() =>
    getInitialFormData(
      task,
      defaultProjectId,
      defaultDueDate,
      preferences.defaultPriority,
    ),
  );
  const [error, setError] = useState('');

  const isEditing = Boolean(task);

  function handleNewProjectChange(event) {
    const { name, value } = event.target;

    setNewProject((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (projectError) setProjectError('');
  }

  function handleCreateProject() {
    const name = newProject.name.trim();

    if (!name) {
      setProjectError('Please enter a project name.');
      return;
    }

    const createdProject = addProject({
      name,
      description: newProject.description.trim(),
      color: newProject.color,
    });

    setFormData((previous) => ({
      ...previous,
      projectId: createdProject.id,
    }));

    setNewProject({
      name: '',
      description: '',
      color: '#8B5CF6',
    });

    setProjectError('');
    setIsCreatingProject(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError('');
  }

  function handleLabelToggle(labelId) {
    setFormData((previous) => {
      const currentLabelIds = previous.labelIds ?? [];

      const labelIds = currentLabelIds.includes(labelId)
        ? currentLabelIds.filter((id) => id !== labelId)
        : [...currentLabelIds, labelId];

      return {
        ...previous,
        labelIds,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = formData.title.trim();

    if (!title) {
      setError('Please enter a task title.');
      return;
    }

    const taskData = {
      ...formData,
      title,
      description: formData.description.trim(),
      projectId: formData.projectId || null,
      labelIds: [...new Set(formData.labelIds ?? [])],
      dueDate: formData.dueDate || null,
      dueTime: formData.dueTime || null,
    };

    if (isEditing) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }

    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit task' : 'Create a task'}
      size='md'
      footer={
        <>
          <Button variant='secondary' onClick={onClose}>
            Cancel
          </Button>

          <Button type='submit' form='task-form'>
            {isEditing ? 'Save changes' : 'Create task'}
          </Button>
        </>
      }
    >
      <form id='task-form' onSubmit={handleSubmit} className='space-y-5'>
        <Input
          label='Task title'
          name='title'
          placeholder='What needs to get done?'
          value={formData.title}
          onChange={handleChange}
          autoFocus
          required
          error={error}
        />

        <div className='space-y-1.5'>
          <label
            htmlFor='task-description'
            className='block text-sm font-medium text-foreground'
          >
            Description
            <span className='ml-1 font-normal text-muted-foreground'>
              (Optional)
            </span>
          </label>

          <textarea
            id='task-description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder='Add more details about this task...'
            rows={3}
            className='
              w-full resize-y rounded-md border border-border
              bg-surface px-3 py-2.5 text-sm text-foreground
              outline-none placeholder:text-muted-foreground
              focus:border-primary focus:ring-2 focus:ring-primary/20
            '
          />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <label
              htmlFor='task-priority'
              className='block text-sm font-medium text-foreground'
            >
              Priority
            </label>

            <select
              id='task-priority'
              name='priority'
              value={formData.priority}
              onChange={handleChange}
              className='
                w-full rounded-md border border-border
                bg-surface px-3 py-2.5 text-sm text-foreground
                outline-none focus:border-primary
              '
            >
              <option value='low'>Low</option>
              <option value='medium'>Medium</option>
              <option value='high'>High</option>
            </select>
          </div>

          <div className='space-y-2'>
            <div className='space-y-1.5'>
              <label
                htmlFor='task-project'
                className='block text-sm font-medium text-foreground'
              >
                Project
                <span className='ml-1 font-normal text-muted-foreground'>
                  (Optional)
                </span>
              </label>

              <select
                id='task-project'
                name='projectId'
                value={formData.projectId}
                onChange={handleChange}
                className='
        w-full rounded-md border border-border bg-surface
        px-3 py-2.5 text-sm text-foreground outline-none
        focus:border-primary focus:ring-2 focus:ring-primary/20
      '
              >
                <option value=''>No project</option>

                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type='button'
              onClick={() => setIsCreatingProject((previous) => !previous)}
              className='inline-flex items-center gap-1.5 text-sm font-medium text-primary transition hover:opacity-80'
            >
              {isCreatingProject ? <X size={15} /> : <Plus size={15} />}
              {isCreatingProject
                ? 'Cancel project creation'
                : 'Create new project'}
            </button>
          </div>

          {isCreatingProject && (
            <div className='space-y-4 rounded-lg border border-border bg-surface-secondary p-4'>
              <div>
                <h3 className='text-sm font-semibold text-foreground'>
                  New project
                </h3>

                <p className='mt-1 text-xs text-muted-foreground'>
                  Create a project and automatically assign it to this task.
                </p>
              </div>

              <div className='space-y-1.5'>
                <label
                  htmlFor='new-project-name'
                  className='text-sm font-medium text-foreground'
                >
                  Project name
                </label>

                <Input
                  id='new-project-name'
                  name='name'
                  placeholder='e.g. Website Redesign'
                  value={newProject.name}
                  onChange={handleNewProjectChange}
                />

                {projectError && (
                  <p className='text-xs text-danger'>{projectError}</p>
                )}
              </div>

              <div className='space-y-1.5'>
                <label
                  htmlFor='new-project-description'
                  className='text-sm font-medium text-foreground'
                >
                  Description
                  <span className='ml-1 font-normal text-muted-foreground'>
                    (Optional)
                  </span>
                </label>

                <textarea
                  id='new-project-description'
                  name='description'
                  value={newProject.description}
                  onChange={handleNewProjectChange}
                  placeholder='What is this project about?'
                  rows={2}
                  className='
          w-full resize-y rounded-md border border-border
          bg-surface px-3 py-2.5 text-sm text-foreground
          outline-none placeholder:text-muted-foreground
          focus:border-primary focus:ring-2 focus:ring-primary/20
        '
                />
              </div>

              <fieldset className='space-y-2'>
                <legend className='text-sm font-medium text-foreground'>
                  Project colour
                </legend>

                <div className='flex flex-wrap gap-3'>
                  {[
                    '#8B5CF6',
                    '#6366F1',
                    '#3B82F6',
                    '#0EA5E9',
                    '#14B8A6',
                    '#10B981',
                    '#F59E0B',
                    '#F97316',
                    '#EC4899',
                    '#64748B',
                  ].map((color) => (
                    <button
                      key={color}
                      type='button'
                      onClick={() =>
                        setNewProject((previous) => ({
                          ...previous,
                          color,
                        }))
                      }
                      aria-label={`Select colour ${color}`}
                      aria-pressed={newProject.color === color}
                      className={`size-7 rounded-full transition ${
                        newProject.color === color
                          ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-secondary'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </fieldset>

              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() => {
                    setIsCreatingProject(false);
                    setProjectError('');
                  }}
                >
                  Cancel
                </Button>

                <Button type='button' onClick={handleCreateProject}>
                  Create & assign
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Labels */}
        <fieldset className='space-y-2'>
          <legend className='text-sm font-medium text-foreground'>
            Labels
            <span className='ml-1 font-normal text-muted-foreground'>
              (Optional)
            </span>
          </legend>

          {labels.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {labels.map((label) => {
                const isSelected = (formData.labelIds ?? []).includes(label.id);

                return (
                  <button
                    key={label.id}
                    type='button'
                    onClick={() => handleLabelToggle(label.id)}
                    aria-pressed={isSelected}
                    className={`
              rounded-full border px-3 py-1.5 text-xs font-medium
              transition-all
              ${
                isSelected
                  ? 'ring-2 ring-primary/30 ring-offset-1'
                  : 'opacity-70 hover:opacity-100'
              }
            `}
                    style={{
                      backgroundColor: `${label.color}20`,
                      borderColor: label.color,
                      color: label.color,
                    }}
                  >
                    {label.name}
                    {isSelected && ' ✓'}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className='text-xs text-muted-foreground'>
              No labels available. Create labels from the Labels page.
            </p>
          )}

          {(formData.labelIds ?? []).length > 0 && (
            <p className='text-xs text-muted-foreground'>
              {formData.labelIds.length}{' '}
              {formData.labelIds.length === 1 ? 'label' : 'labels'} selected
            </p>
          )}
        </fieldset>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Input
            label='Due date'
            name='dueDate'
            type='date'
            value={formData.dueDate}
            onChange={handleChange}
          />

          <Input
            label='Due time'
            name='dueTime'
            type='time'
            value={formData.dueTime}
            onChange={handleChange}
          />
        </div>
      </form>
    </Modal>
  );
}
