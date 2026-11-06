import { useEffect, useReducer } from 'react';

import { LabelContext } from './labelContext';
import { labelReducer } from './labelReducer';
import { loadLabels, saveLabels } from './labelStorage';
import { useTasks } from '../tasks/useTasks';

export function LabelProvider({ children }) {
  const [labels, dispatch] = useReducer(labelReducer, undefined, loadLabels);

  const { tasks, updateTask } = useTasks();

  useEffect(() => {
    saveLabels(labels);
  }, [labels]);

  function addLabel(labelData) {
    const name = labelData.name?.trim();

    if (!name) return null;

    const now = new Date().toISOString();

    const newLabel = {
      id: crypto.randomUUID(),
      ...labelData,
      name,
      color: labelData.color ?? 'violet',
      createdAt: now,
      updatedAt: now,
    };

    dispatch({
      type: 'ADD_LABEL',
      payload: newLabel,
    });

    return newLabel;
  }

  function updateLabel(id, updates) {
    const normalizedUpdates = {
      ...updates,
      ...(updates.name !== undefined && {
        name: updates.name.trim(),
      }),
      updatedAt: new Date().toISOString(),
    };

    dispatch({
      type: 'UPDATE_LABEL',
      payload: {
        id,
        updates: normalizedUpdates,
      },
    });
  }

  function deleteLabel(id) {
    // Remove the deleted label ID from all associated tasks.
    tasks
      .filter((task) => (task.labelIds ?? []).includes(id))
      .forEach((task) => {
        updateTask(task.id, {
          labelIds: task.labelIds.filter((labelId) => labelId !== id),
        });
      });

    dispatch({
      type: 'DELETE_LABEL',
      payload: id,
    });
  }

  function replaceLabels(labels) {
    dispatch({
      type: 'LOAD_LABELS',
      payload: labels,
    });
  }

  const value = {
    labels,
    addLabel,
    updateLabel,
    deleteLabel,
    replaceLabels,
  };

  return (
    <LabelContext.Provider value={value}>{children}</LabelContext.Provider>
  );
}
