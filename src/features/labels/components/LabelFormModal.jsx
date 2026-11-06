import { useState } from 'react';

import { Button, Input, Modal } from '../../../components/ui';
import { useLabels } from '../useLabels';

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

export default function LabelFormModal({ isOpen, onClose, label = null }) {
  const { labels, addLabel, updateLabel } = useLabels();

  const [formData, setFormData] = useState(() => ({
    name: label?.name ?? '',
    color: label?.color ?? LABEL_COLORS[0],
  }));

  const [error, setError] = useState('');

  const isEditing = Boolean(label);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) setError('');
  }

  function handleColorChange(color) {
    setFormData((current) => ({
      ...current,
      color,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setError('Please enter a label name.');
      return;
    }

    const duplicateLabel = labels.some(
      (existingLabel) =>
        existingLabel.id !== label?.id &&
        existingLabel.name.trim().toLowerCase() === trimmedName.toLowerCase(),
    );

    if (duplicateLabel) {
      setError('A label with this name already exists.');
      return;
    }

    const labelData = {
      name: trimmedName,
      color: formData.color,
    };

    if (isEditing) {
      updateLabel(label.id, labelData);
    } else {
      addLabel(labelData);
    }

    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit label' : 'Create label'}
    >
      <form onSubmit={handleSubmit} className='space-y-5'>
        <div>
          <label
            htmlFor='label-name'
            className='mb-2 block text-sm font-medium'
          >
            Label name
          </label>

          <Input
            id='label-name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='e.g. Work, Personal, Urgent'
            autoFocus
          />

          {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}
        </div>

        <div>
          <p className='mb-3 text-sm font-medium'>Label colour</p>

          <div className='flex flex-wrap gap-3'>
            {LABEL_COLORS.map((color) => (
              <button
                key={color}
                type='button'
                onClick={() => handleColorChange(color)}
                aria-label={`Select colour ${color}`}
                aria-pressed={formData.color === color}
                className={`h-8 w-8 rounded-full transition-all ${
                  formData.color === color
                    ? 'ring-2 ring-offset-2 ring-violet-500'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-2'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Cancel
          </Button>

          <Button type='submit'>
            {isEditing ? 'Save changes' : 'Create label'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
