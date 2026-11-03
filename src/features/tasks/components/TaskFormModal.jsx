import { useState } from 'react';
import { Button, Input, Modal } from '../../../components/ui';
import { useTasks } from '../useTasks';

const getInitialFormData = (task) => ({
  title: task?.title ?? '',
  description: task?.description ?? '',
  projectId: task?.projectId ?? '',
  dueDate: task?.dueDate ?? '',
  dueTime: task?.dueTime ?? '',
  priority: task?.priority ?? 'medium',
});

export default function TaskFormModal({
  isOpen,
  onClose,
  task = null,
  projects = [],
}) {
  const { addTask, updateTask } = useTasks();

  const [formData, setFormData] = useState(() => getInitialFormData(task));
  const [error, setError] = useState('');

  const isEditing = Boolean(task);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError('');
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

          <div className='space-y-1.5'>
            <label
              htmlFor='task-project'
              className='block text-sm font-medium text-foreground'
            >
              Project
            </label>

            <select
              id='task-project'
              name='projectId'
              value={formData.projectId}
              onChange={handleChange}
              className='
                w-full rounded-md border border-border
                bg-surface px-3 py-2.5 text-sm text-foreground
                outline-none focus:border-primary
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
      </form>
    </Modal>
  );
}
