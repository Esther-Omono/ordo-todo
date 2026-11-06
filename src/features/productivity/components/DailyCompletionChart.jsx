import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function DailyCompletionChart({ data = [] }) {
  return (
    <section className='rounded-xl border border-border bg-surface p-5'>
      <div className='mb-6'>
        <h3 className='font-semibold text-foreground'>Daily completion</h3>

        <p className='mt-1 text-sm text-muted-foreground'>
          Tasks completed over the last 7 days.
        </p>
      </div>

      <div className='h-64 w-full'>
        {data.length > 0 ? (
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
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
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
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

              <Line
                type='monotone'
                dataKey='completed'
                name='Completed tasks'
                stroke='var(--color-primary)'
                strokeWidth={3}
                dot={{ r: 4, fill: 'var(--color-primary)' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
            No completion data available yet.
          </div>
        )}
      </div>
    </section>
  );
}
