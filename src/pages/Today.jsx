import { useTasks } from '../features/tasks/useTasks';
import { getTodayTasks, sortTasks } from '../features/tasks/taskSelectors';
import TaskListView from '../features/tasks/components/TaskListView';

export default function Today() {
  const { tasks } = useTasks();

  const todayTasks = sortTasks(getTodayTasks(tasks), 'dueDate', 'asc');

  return (
    <TaskListView
      title='Today'
      description='Focus on what needs your attention.'
      tasks={todayTasks}
      emptyTitle="You're all caught up!"
      emptyDescription='No outstanding tasks for today. Enjoy the breathing room.'
    />
  );
}
