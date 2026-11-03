import { useState } from 'react';
import { Plus, FolderKanban } from 'lucide-react';

import { Button } from '../components/ui';
import { useProjects } from '../features/projects/useProjects';
import { ProjectCard, ProjectFormModal } from '../features/projects/components';

export default function Projects() {
  const { projects } = useProjects();
  const [isCreating, setIsCreating] = useState(false);

  return (
    <>
      <div className='mx-auto w-full max-w-6xl space-y-8'>
        <header className='flex items-center justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight text-foreground'>
              Projects
            </h2>

            <p className='mt-1 text-sm text-muted-foreground'>
              Organise your tasks into meaningful groups.
            </p>
          </div>

          <Button onClick={() => setIsCreating(true)}>
            <Plus size={17} />
            <span className='hidden sm:inline'>New project</span>
            <span className='sm:hidden'>New</span>
          </Button>
        </header>

        <section>
          {projects.length > 0 ? (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-16 text-center'>
              <div className='mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary'>
                <FolderKanban size={25} />
              </div>

              <h3 className='text-base font-semibold text-foreground'>
                No projects yet
              </h3>

              <p className='mt-2 max-w-sm text-sm text-muted-foreground'>
                Create your first project to bring related tasks together.
              </p>

              <Button className='mt-5' onClick={() => setIsCreating(true)}>
                <Plus size={16} />
                Create project
              </Button>
            </div>
          )}
        </section>
      </div>

      {isCreating && (
        <ProjectFormModal
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
        />
      )}
    </>
  );
}
