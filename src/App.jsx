// import AppRoutes from './routes/AppRoutes';
import { Button, Badge, ThemeToggle } from './components/ui';

function App() {
  return (
    // <AppRoutes />
    <main className='min-h-screen bg-background p-10 text-foreground'>
      <div className='mx-auto max-w-lg space-y-6 rounded-xl border border-border bg-surface p-8 shadow-sm'>
        <div>
          <h1 className='text-2xl font-semibold'>Welcome to Ordo</h1>

          <p className='mt-2 text-muted-foreground'>
            Your productivity, organised.
          </p>
        </div>

        <div className='flex flex-wrap gap-3'>
          <Button>Create task</Button>
          <Button variant='secondary'>Cancel</Button>
          <Badge variant='success'>Active</Badge>
        </div>

        <ThemeToggle />
      </div>
    </main>
  );
}

export default App;
