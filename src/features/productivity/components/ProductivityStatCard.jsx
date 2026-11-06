export default function ProductivityStatCard({ stat, value }) {
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
