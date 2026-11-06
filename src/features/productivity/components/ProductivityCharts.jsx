import DailyCompletionChart from './DailyCompletionChart';
import WeeklyCompletionChart from './WeeklyCompletionChart';
import ProjectProgressChart from './ProjectProgressChart';

export default function ProductivityCharts({
  dailyTrend,
  weeklyTrend,
  projectProgress,
}) {
  return (
    <section className='space-y-5'>
      <div>
        <h2 className='text-lg font-semibold text-foreground'>
          Productivity trends
        </h2>

        <p className='mt-1 text-sm text-muted-foreground'>
          Understand your task completion patterns and project progress.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
        <DailyCompletionChart data={dailyTrend} />

        <WeeklyCompletionChart data={weeklyTrend} />

        <div className='xl:col-span-2'>
          <ProjectProgressChart data={projectProgress} />
        </div>
      </div>
    </section>
  );
}
