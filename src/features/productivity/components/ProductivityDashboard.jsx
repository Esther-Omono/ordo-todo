import {
  ListTodo,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Target,
} from 'lucide-react';

import { useTasks } from '../../tasks/useTasks';
import { getTaskStatistics } from '../utils/productivityUtils';
import ProductivityStatCard from './ProductivityStatCard';

const STAT_CARDS = [
  {
    key: 'total',
    label: 'Total Tasks',
    description: 'All tasks created',
    icon: ListTodo,
    iconStyle:
      'bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
  },
  {
    key: 'completed',
    label: 'Completed',
    description: 'Tasks successfully finished',
    icon: CheckCircle2,
    iconStyle:
      'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
  {
    key: 'pending',
    label: 'Pending',
    description: 'Tasks still to be completed',
    icon: Clock3,
    iconStyle:
      'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  },
  {
    key: 'overdue',
    label: 'Overdue',
    description: 'Tasks past their due date',
    icon: AlertCircle,
    iconStyle: 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  },
  {
    key: 'completionRate',
    label: 'Completion Rate',
    description: 'Percentage of tasks completed',
    icon: Target,
    iconStyle:
      'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    suffix: '%',
  },
];

export default function ProductivityDashboard() {
  const { tasks = [] } = useTasks();
  const statistics = getTaskStatistics(tasks);

  return (
    <section className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
          Productivity Overview
        </h2>

        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          A snapshot of your task activity and progress.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5'>
        {STAT_CARDS.map((stat) => (
          <ProductivityStatCard
            key={stat.key}
            stat={stat}
            value={statistics[stat.key]}
          />
        ))}
      </div>
    </section>
  );
}
