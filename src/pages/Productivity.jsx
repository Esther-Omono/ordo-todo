import ProductivityDashboard from '../features/productivity/components/ProductivityDashboard';
import ProductivityCharts from '../features/productivity/components/ProductivityCharts';

import { useTasks } from '../features/tasks/useTasks';
import { useProjects } from '../features/projects/useProjects';

import {
  getDailyCompletionTrend,
  getWeeklyCompletionTrend,
  getProjectProgress,
} from '../features/productivity/utils/productivityUtils';

export default function Productivity() {
  const { tasks = [] } = useTasks();
  const { projects = [] } = useProjects();

  const dailyTrend = getDailyCompletionTrend(tasks, 7);
  const weeklyTrend = getWeeklyCompletionTrend(tasks, 6);
  const projectProgress = getProjectProgress(projects, tasks);

  return (
    <div className='mx-auto w-full max-w-7xl space-y-8'>
      {/* Page heading */}
      <header>
        <h1 className='text-2xl font-semibold tracking-tight text-foreground'>
          Productivity
        </h1>

        <p className='mt-1 text-sm text-muted-foreground'>
          Understand your progress and build better productivity habits.
        </p>
      </header>

      {/* Productivity statistics */}
      <ProductivityDashboard />

      {/* Productivity charts */}
      <ProductivityCharts
        dailyTrend={dailyTrend}
        weeklyTrend={weeklyTrend}
        projectProgress={projectProgress}
      />
    </div>
  );
}
