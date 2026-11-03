import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNavigation from './MobileNavigation';

export default function AppLayout() {
  return (
    <div className='flex h-dvh overflow-hidden bg-background'>
      <Sidebar />

      <div className='flex min-w-0 flex-1 flex-col'>
        <Header />

        <main
          className='
          min-h-0 flex-1 overflow-y-auto
          px-5 py-6 pb-24 sm:px-8 sm:py-8
          lg:pb-8
        '
        >
          <Outlet />
        </main>
      </div>

      <MobileNavigation />
    </div>
  );
}
