import { useState } from 'react';
import { Button, Modal } from '../../../components/ui';
import { useProjects } from '../useProjects';

const PROJECT_COLORS = [
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
];

const initialFormState = {
  name: '',
  description: '',
  color: '#8B5CF6',
};

export default function ProjectFormModal({ isOpen, onClose, project = null }) {
  const { addProject, updateProject } = useProjects();

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');

  const isEditing = Boolean(project);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();

    const name = formData.name.trim();

    if (!name) {
      setError('Please enter a project name.');
      return;
    }

    const projectData = {
      ...formData,
      name,
      description: formData.description.trim(),
    };

    if (isEditing) {
      updateProject(project.id, projectData);
    } else {
      addProject(projectData);
    }

    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit project' : 'Create project'}
      size='md'
      footer={
        <>
          <Button variant='secondary' onClick={onClose}>
            Cancel
          </Button>

          <Button type='submit' form='project-form'>
            {isEditing ? 'Save changes' : 'Create project'}
          </Button>
        </>
      }
    >
      <form id='project-form' onSubmit={handleSubmit} className='space-y-5'>
        <div className='space-y-1.5'>
          <label
            htmlFor='project-name'
            className='text-sm font-medium text-foreground'
          >
            Project name
          </label>

          <input
            id='project-name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='e.g. Personal Development'
            className='w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
            autoFocus
          />

          {error && <p className='text-xs text-danger'>{error}</p>}
        </div>

        <div className='space-y-1.5'>
          <label
            htmlFor='project-description'
            className='text-sm font-medium text-foreground'
          >
            Description
            <span className='ml-1 font-normal text-muted-foreground'>
              (Optional)
            </span>
          </label>

          <textarea
            id='project-description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder='What is this project about?'
            rows={3}
            className='w-full resize-y rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
          />
        </div>

        <fieldset className='space-y-3'>
          <legend className='text-sm font-medium text-foreground'>
            Project colour
          </legend>

          <div className='flex flex-wrap gap-3'>
            {PROJECT_COLORS.map((color) => (
              <button
                key={color}
                type='button'
                onClick={() =>
                  setFormData((previous) => ({
                    ...previous,
                    color,
                  }))
                }
                aria-label={`Select colour ${color}`}
                aria-pressed={formData.color === color}
                className={`size-8 rounded-full transition ${
                  formData.color === color
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
