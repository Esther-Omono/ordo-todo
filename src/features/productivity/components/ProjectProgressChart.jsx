import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function ProjectProgressChart({ data = [] }) {
  const projectsWithTasks = data.filter((project) => project.total > 0);

  return (
    <section className='rounded-xl border border-border bg-surface p-5'>
      <div className='mb-6'>
        <h3 className='font-semibold text-foreground'>Project progress</h3>

        <p className='mt-1 text-sm text-muted-foreground'>
          Completed tasks across your projects.
        </p>
      </div>

      {projectsWithTasks.length > 0 ? (
        <div className='space-y-5'>
          <div className='h-64 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={projectsWithTasks}
                  dataKey='completed'
                  nameKey='projectName'
                  cx='50%'
                  cy='50%'
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {projectsWithTasks.map((project) => (
                    <Cell
                      key={project.projectId}
                      fill={project.projectColor || '#8B5CF6'}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className='space-y-3'>
            {projectsWithTasks.map((project) => (
              <div
                key={project.projectId}
                className='flex items-center justify-between gap-3'
              >
                <div className='flex min-w-0 items-center gap-2'>
                  <span
                    className='size-3 shrink-0 rounded-full'
                    style={{
                      backgroundColor: project.projectColor || '#8B5CF6',
                    }}
                  />

                  <span className='truncate text-sm text-foreground'>
                    {project.projectName}
                  </span>
                </div>

                <span className='shrink-0 text-sm font-medium text-muted-foreground'>
                  {project.completionRate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='flex h-64 items-center justify-center text-sm text-muted-foreground'>
          Create projects and assign tasks to see progress.
        </div>
      )}
    </section>
  );
}
