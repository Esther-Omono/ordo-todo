import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='flex min-h-full flex-col items-center justify-center text-center'>
      <h2 className='text-5xl font-bold text-primary'>404</h2>

      <p className='mt-3 text-muted-foreground'>
        We couldn't find the page you're looking for.
      </p>

      <Link
        to='/today'
        className='mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover'
      >
        Back to Today
      </Link>
    </div>
  );
}
