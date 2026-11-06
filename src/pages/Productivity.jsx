import ProductivityDashboard from '../features/productivity/components/ProductivityDashboard';

export default function Productivity() {
  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
          Productivity
        </h1>

        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Understand your progress and build better productivity habits.
        </p>
      </div>

      <ProductivityDashboard />
    </div>
  );
}
