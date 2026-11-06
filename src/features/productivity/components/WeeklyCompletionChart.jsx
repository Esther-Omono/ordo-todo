import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function WeeklyCompletionChart({ data = [] }) {
  return (
    <section className='rounded-xl border border-border bg-surface p-5'>
      <div className='mb-6'>
        <h3 className='font-semibold text-foreground'>Weekly completion</h3>

        <p className='mt-1 text-sm text-muted-foreground'>
          Your completed tasks over the last 6 weeks.
        </p>
      </div>

      <div className='h-64 w-full'>
        {data.length > 0 ? (
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='var(--color-border)'
                vertical={false}
              />

              <XAxis
                dataKey='label'
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  color: 'var(--color-foreground)',
                }}
              />

              <Bar
                dataKey='completed'
                name='Completed tasks'
                fill='var(--color-primary)'
                radius={[5, 5, 0, 0]}
                maxBarSize={42}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
            No weekly data available yet.
          </div>
        )}
      </div>
    </section>
  );
}
