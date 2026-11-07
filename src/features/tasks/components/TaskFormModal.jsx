import { useState } from 'react';
import { Button, Input, Modal } from '../../../components/ui';
import { useTasks } from '../useTasks';
import { useProjects } from '../../projects/useProjects';
import { usePreferences } from '../../preferences/usePreferences';
import { useLabels } from '../../labels/useLabels';
import { Plus, X } from 'lucide-react';

const LABEL_COLORS = [
  '#BE123C',
  '#9D174D',
  '#A21CAF',
  '#7C2D12',
  '#B45309',
  '#4D7C0F',
  '#166534',
  '#115E59',
  '#155E75',
  '#334155',
];

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
  recurrence: task?.recurrence ?? null,
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
  const { labels, addLabel } = useLabels();

  const [isCreatingLabel, setIsCreatingLabel] = useState(false);

  const [newLabel, setNewLabel] = useState({
    name: '',
    color: LABEL_COLORS[0],
  });

  const [labelError, setLabelError] = useState('');

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

  function handleNewLabelChange(event) {
    const { name, value } = event.target;

    setNewLabel((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (labelError) setLabelError('');
  }

  function handleCreateLabel() {
    const name = newLabel.name.trim();

    if (!name) {
      setLabelError('Please enter a label name.');
      return;
    }

    const duplicateLabel = labels.some(
      (label) => label.name.trim().toLowerCase() === name.toLowerCase(),
    );

    if (duplicateLabel) {
      setLabelError('A label with this name already exists.');
      return;
    }

    const createdLabel = addLabel({
      name,
      color: newLabel.color,
    });

    if (!createdLabel) return;

    setFormData((previous) => ({
      ...previous,
      labelIds: [...new Set([...(previous.labelIds ?? []), createdLabel.id])],
    }));

    setNewLabel({
      name: '',
      color: LABEL_COLORS[0],
    });

    setLabelError('');
    setIsCreatingLabel(false);
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
      recurrence: formData.recurrence,
      recurringSeriesId: formData.recurrence
        ? (task?.recurringSeriesId ?? task?.id ?? null)
        : null,
      occurrenceDate: formData.recurrence
        ? (task?.occurrenceDate ?? formData.dueDate ?? null)
        : null,
    };

    if (isEditing) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }

    onClose();
  }

  function updateRecurrence(updates) {
    setFormData((previous) => ({
      ...previous,
      recurrence: {
        frequency: 'daily',
        interval: 1,
        daysOfWeek: [],
        endDate: null,
        unit: 'day',
        ...previous.recurrence,
        ...updates,
      },
    }));
  }

  function toggleRecurrenceDay(day) {
    const selectedDays = formData.recurrence?.daysOfWeek ?? [];

    const daysOfWeek = selectedDays.includes(day)
      ? selectedDays.filter((item) => item !== day)
      : [...selectedDays, day];

    updateRecurrence({ daysOfWeek });
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
        <div className='space-y-3'>
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
                  const isSelected = (formData.labelIds ?? []).includes(
                    label.id,
                  );

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
                No labels available. Create one below.
              </p>
            )}

            {(formData.labelIds ?? []).length > 0 && (
              <p className='text-xs text-muted-foreground'>
                {formData.labelIds.length}{' '}
                {formData.labelIds.length === 1 ? 'label' : 'labels'} selected
              </p>
            )}
          </fieldset>

          {/* Create label toggle */}
          <button
            type='button'
            onClick={() => {
              setIsCreatingLabel((previous) => !previous);
              setLabelError('');
            }}
            className='inline-flex items-center gap-1.5 text-sm font-medium text-primary transition hover:opacity-80'
          >
            {isCreatingLabel ? <X size={15} /> : <Plus size={15} />}
            {isCreatingLabel ? 'Cancel label creation' : 'Create new label'}
          </button>

          {/* Inline label creation */}
          {isCreatingLabel && (
            <div className='space-y-4 rounded-lg border border-border bg-surface-secondary p-4'>
              <div>
                <h3 className='text-sm font-semibold text-foreground'>
                  New label
                </h3>

                <p className='mt-1 text-xs text-muted-foreground'>
                  Create a label and automatically assign it to this task.
                </p>
              </div>

              <div className='space-y-1.5'>
                <label
                  htmlFor='new-label-name'
                  className='text-sm font-medium text-foreground'
                >
                  Label name
                </label>

                <Input
                  id='new-label-name'
                  name='name'
                  placeholder='e.g. Urgent, Personal, Research'
                  value={newLabel.name}
                  onChange={handleNewLabelChange}
                />

                {labelError && (
                  <p className='text-xs text-danger'>{labelError}</p>
                )}
              </div>

              <fieldset className='space-y-2'>
                <legend className='text-sm font-medium text-foreground'>
                  Label colour
                </legend>

                <div className='flex flex-wrap gap-3'>
                  {LABEL_COLORS.map((color) => (
                    <button
                      key={color}
                      type='button'
                      onClick={() =>
                        setNewLabel((previous) => ({
                          ...previous,
                          color,
                        }))
                      }
                      aria-label={`Select colour ${color}`}
                      aria-pressed={newLabel.color === color}
                      className={`size-7 rounded-full transition ${
                        newLabel.color === color
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
                    setIsCreatingLabel(false);
                    setLabelError('');
                  }}
                >
                  Cancel
                </Button>

                <Button type='button' onClick={handleCreateLabel}>
                  Create & assign
                </Button>
              </div>
            </div>
          )}
        </div>

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

        <div className='space-y-3'>
          <label className='block text-sm font-medium text-foreground'>
            Repeat
          </label>

          <select
            value={formData.recurrence?.frequency ?? 'none'}
            onChange={(event) => {
              const frequency = event.target.value;

              setFormData((previous) => ({
                ...previous,
                recurrence:
                  frequency === 'none'
                    ? null
                    : {
                        frequency,
                        interval: 1,
                        daysOfWeek: [],
                        endDate: null,
                        unit: 'day',
                      },
              }));
            }}
            className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground'
          >
            <option value='none'>Does not repeat</option>
            <option value='daily'>Daily</option>
            <option value='weekly'>Weekly</option>
            <option value='monthly'>Monthly</option>
            <option value='custom'>Custom</option>
          </select>

          {formData.recurrence && (
            <div className='space-y-3 rounded-lg border border-border p-3'>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-muted-foreground'>Every</span>

                <Input
                  type='number'
                  min='1'
                  value={formData.recurrence.interval}
                  onChange={(event) =>
                    updateRecurrence({
                      interval: Math.max(1, Number(event.target.value)),
                    })
                  }
                />

                {formData.recurrence.frequency === 'custom' ? (
                  <select
                    value={formData.recurrence.unit ?? 'day'}
                    onChange={(event) =>
                      updateRecurrence({ unit: event.target.value })
                    }
                    className='rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground'
                  >
                    <option value='day'>Days</option>
                    <option value='week'>Weeks</option>
                    <option value='month'>Months</option>
                  </select>
                ) : (
                  <span className='text-sm text-muted-foreground'>
                    {formData.recurrence.frequency === 'daily' && 'day(s)'}
                    {formData.recurrence.frequency === 'weekly' && 'week(s)'}
                    {formData.recurrence.frequency === 'monthly' && 'month(s)'}
                  </span>
                )}
              </div>

              {formData.recurrence.frequency === 'weekly' && (
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-foreground'>
                    Repeat on
                  </p>

                  <div className='flex flex-wrap gap-2'>
                    {[
                      { label: 'Sun', value: 0 },
                      { label: 'Mon', value: 1 },
                      { label: 'Tue', value: 2 },
                      { label: 'Wed', value: 3 },
                      { label: 'Thu', value: 4 },
                      { label: 'Fri', value: 5 },
                      { label: 'Sat', value: 6 },
                    ].map((day) => {
                      const selected = formData.recurrence.daysOfWeek?.includes(
                        day.value,
                      );

                      return (
                        <button
                          key={day.value}
                          type='button'
                          onClick={() => toggleRecurrenceDay(day.value)}
                          className={`rounded-full border px-3 py-1.5 text-xs ${
                            selected
                              ? 'border-primary bg-primary text-white'
                              : 'border-border text-muted-foreground'
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>

                  <p className='text-xs text-muted-foreground'>
                    Leave all days unselected to repeat on the same weekday.
                  </p>
                </div>
              )}

              <div className='space-y-1'>
                <label className='block text-sm font-medium text-foreground'>
                  Ends on (optional)
                </label>

                <Input
                  type='date'
                  value={formData.recurrence.endDate ?? ''}
                  min={formData.dueDate || undefined}
                  onChange={(event) =>
                    updateRecurrence({
                      endDate: event.target.value || null,
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}
