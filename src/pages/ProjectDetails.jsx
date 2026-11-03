import { useParams } from 'react-router-dom';
import { useTasks } from '../features/tasks/useTasks';
import { getProjectTasks, sortTasks } from '../features/tasks/taskSelectors';
import TaskListView from '../features/tasks/components/TaskListView';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { tasks } = useTasks();

  const projectTasks = sortTasks(
    getProjectTasks(tasks, projectId),
    'createdAt',
    'desc',
  );

  return (
    <TaskListView
      title='Project Tasks'
      description='Tasks associated with this project.'
      tasks={projectTasks}
      emptyTitle='No tasks in this project'
      emptyDescription='Tasks assigned to this project will appear here.'
    />
  );
}
