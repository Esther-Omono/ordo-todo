import { useTasks } from '../features/tasks/useTasks';
import { getCompletedTasks, sortTasks } from '../features/tasks/taskSelectors';
import TaskListView from '../features/tasks/components/TaskListView';

export default function Completed() {
  const { tasks } = useTasks();

  const completedTasks = sortTasks(
    getCompletedTasks(tasks),
    'updatedAt',
    'desc',
  );

  return (
    <TaskListView
      title='Completed'
      description="Look back at everything you've accomplished."
      tasks={completedTasks}
      emptyTitle='Nothing completed yet'
      emptyDescription='Completed tasks will appear here.'
    />
  );
}
