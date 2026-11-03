import { useTasks } from '../features/tasks/useTasks';
import { getUpcomingTasks, sortTasks } from '../features/tasks/taskSelectors';
import TaskListView from '../features/tasks/components/TaskListView';

export default function Upcoming() {
  const { tasks } = useTasks();

  const upcomingTasks = sortTasks(getUpcomingTasks(tasks), 'dueDate', 'asc');

  return (
    <TaskListView
      title='Upcoming'
      description="See what's coming up next."
      tasks={upcomingTasks}
      emptyTitle='Nothing coming up'
      emptyDescription="You don't have any upcoming tasks. Add one whenever you're ready."
    />
  );
}
