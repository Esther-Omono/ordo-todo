import { describe, expect, it } from 'vitest';
import { searchTasks } from './searchTasks';

const tasks = [
  {
    id: '1',
    title: 'Finish portfolio',
    description: 'Complete the Ordo project.',
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Milk, bread and eggs.',
  },
  {
    id: '3',
    title: 'Prepare for interview',
    description: 'Review React and JavaScript concepts.',
  },
];

describe('searchTasks', () => {
  it('finds tasks by title', () => {
    expect(searchTasks(tasks, 'portfolio')).toHaveLength(1);
    expect(searchTasks(tasks, 'portfolio')[0].id).toBe('1');
  });

  it('finds tasks by description', () => {
    expect(searchTasks(tasks, 'javascript')).toHaveLength(1);
    expect(searchTasks(tasks, 'javascript')[0].id).toBe('3');
  });

  it('matches without case sensitivity', () => {
    expect(searchTasks(tasks, 'GROCERIES')).toHaveLength(1);
  });

  it('ignores leading and trailing whitespace', () => {
    expect(searchTasks(tasks, '  portfolio  ')).toHaveLength(1);
  });

  it('supports multiple search terms', () => {
    expect(searchTasks(tasks, 'portfolio finish')).toHaveLength(1);
  });

  it('matches multiple terms across title and description', () => {
    expect(searchTasks(tasks, 'portfolio ordo')).toHaveLength(1);
  });

  it('requires all search terms to match', () => {
    expect(searchTasks(tasks, 'portfolio groceries')).toHaveLength(0);
  });

  it('returns an empty array for an empty query', () => {
    expect(searchTasks(tasks, '')).toEqual([]);
    expect(searchTasks(tasks, '   ')).toEqual([]);
  });

  it('returns an empty array when there are no matches', () => {
    expect(searchTasks(tasks, 'nonexistent')).toEqual([]);
  });

  it('handles missing descriptions', () => {
    const tasksWithoutDescription = [{ id: '4', title: 'Review application' }];

    expect(searchTasks(tasksWithoutDescription, 'application')).toHaveLength(1);
  });

  it('handles an empty task collection', () => {
    expect(searchTasks([], 'portfolio')).toEqual([]);
  });

  it('handles tasks with missing titles and descriptions', () => {
    expect(searchTasks([{ id: '5' }], 'anything')).toEqual([]);
  });
});
