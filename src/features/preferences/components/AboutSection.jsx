import { CheckCircle2, Code2, Heart } from 'lucide-react';

const technologies = [
  'React',
  'Vite',
  'Tailwind CSS',
  'React Router',
  'date-fns',
  'Lucide React',
  'Vitest',
];

// Calculate once outside the component render cycle
const CURRENT_YEAR = new Date().getFullYear();

export default function AboutSection() {
  return (
    <div className='space-y-5'>
      <div className='flex items-start gap-4'>
        <div className='flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white'>
          O
        </div>

        <div>
          <h3 className='text-lg font-semibold text-foreground'>Ordo</h3>

          <p className='text-sm text-muted-foreground'>
            Your tasks. Your projects. Your productivity.
          </p>

          <span className='mt-2 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success'>
            <CheckCircle2 size={13} />
            Version 1.0.0
          </span>
        </div>
      </div>

      <div className='border-t border-border pt-5'>
        <h4 className='text-sm font-medium text-foreground'>
          About the application
        </h4>

        <p className='mt-2 text-sm leading-6 text-muted-foreground'>
          Ordo is a personal productivity application designed to help you
          organise tasks, manage projects, plan your time and stay focused on
          what matters.
        </p>
      </div>

      <div className='border-t border-border pt-5'>
        <div className='mb-3 flex items-center gap-2'>
          <Code2 size={17} className='text-primary' />
          <h4 className='text-sm font-medium text-foreground'>Built with</h4>
        </div>

        <div className='flex flex-wrap gap-2'>
          {technologies.map((technology) => (
            <span
              key={technology}
              className='rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground'
            >
              {technology}
            </span>
          ))}
        </div>
      </div>

      <div className='border-t border-border pt-5'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Heart size={15} className='text-primary' />
          <p>Designed and developed as a personal portfolio project.</p>
        </div>
      </div>

      <p className='text-xs text-muted-foreground'>
        © {CURRENT_YEAR} Ordo. All rights reserved.
      </p>
    </div>
  );
}
