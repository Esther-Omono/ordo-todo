import { useTasks } from '../features/tasks/hooks/useTasks';
import { getOverdueTasks, sortTasks } from '../features/tasks/taskSelectors';
import TaskListView from '../features/tasks/components/TaskListView';

export default function Overdue() {
  const { tasks } = useTasks();

  const overdueTasks = sortTasks(getOverdueTasks(tasks), 'dueDate', 'asc');

  return (
    <TaskListView
      title='Overdue'
      description='Tasks that have passed their due date and still need your attention.'
      tasks={overdueTasks}
      emptyTitle="You're all caught up!"
      emptyDescription="You don't have any overdue tasks. Keep it that way!"
    />
  );
}
