import { useTasks } from '../features/tasks/useTasks';
import { getAllTasks, sortTasks } from '../features/tasks/taskSelectors';
import TaskListView from '../features/tasks/components/TaskListView';

export default function AllTasks() {
  const { tasks } = useTasks();

  const allTasks = sortTasks(getAllTasks(tasks), 'createdAt', 'desc');

  return (
    <TaskListView
      title='All Tasks'
      description='Everything you need to get done, in one place.'
      tasks={allTasks}
      emptyTitle='Your task list is empty'
      emptyDescription='Create your first task to start organising your day.'
    />
  );
}
