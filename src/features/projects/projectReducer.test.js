import { describe, it, expect } from 'vitest';
import { projectReducer } from './projectReducer';

const sampleProject = {
  id: 'project-1',
  name: 'Personal Development',
  description: 'Learning goals',
  color: '#8B5CF6',
  createdAt: '2026-11-03T10:00:00.000Z',
  updatedAt: '2026-11-03T10:00:00.000Z',
};

describe('projectReducer', () => {
  it('adds a project', () => {
    const result = projectReducer([], {
      type: 'ADD_PROJECT',
      payload: sampleProject,
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Personal Development');
  });

  it('updates a project', () => {
    const result = projectReducer([sampleProject], {
      type: 'UPDATE_PROJECT',
      payload: {
        id: 'project-1',
        updates: { name: 'Career Development' },
      },
    });

    expect(result[0].name).toBe('Career Development');
    expect(result[0].id).toBe('project-1');
  });

  it('deletes a project', () => {
    const result = projectReducer([sampleProject], {
      type: 'DELETE_PROJECT',
      payload: 'project-1',
    });

    expect(result).toHaveLength(0);
  });

  it('does not modify existing state', () => {
    const state = [sampleProject];

    const result = projectReducer(state, {
      type: 'UPDATE_PROJECT',
      payload: {
        id: 'project-1',
        updates: { name: 'Updated name' },
      },
    });

    expect(state[0].name).toBe('Personal Development');
    expect(result[0].name).toBe('Updated name');
  });
});
