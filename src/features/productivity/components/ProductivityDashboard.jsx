import {
  ListTodo,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Target,
} from 'lucide-react';

import { useTasks } from '../../tasks/useTasks';
import { getTaskStatistics } from '../utils/productivityUtils';

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

function ProductivityStatCard({ stat, value }) {
  const Icon = stat.icon;

  return (
    <article className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
            {stat.label}
          </p>

          <p className='mt-3 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white'>
            {value}
            {stat.suffix && (
              <span className='ml-0.5 text-xl'>{stat.suffix}</span>
            )}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${stat.iconStyle}`}>
          <Icon size={21} strokeWidth={1.8} />
        </div>
      </div>

      <p className='mt-4 text-xs text-gray-500 dark:text-gray-400'>
        {stat.description}
      </p>
    </article>
  );
}

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
