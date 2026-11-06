import { useState } from 'react';
import { Plus, Tag } from 'lucide-react';

import { Button } from '../components/ui';
import { useLabels } from '../features/labels/useLabels';
import { LabelCard, LabelFormModal } from '../features/labels/components/index';

export default function Labels() {
  const { labels } = useLabels();
  const [isCreating, setIsCreating] = useState(false);

  return (
    <>
      <div className='mx-auto w-full max-w-6xl space-y-8'>
        <header className='flex items-center justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight text-foreground'>
              Labels
            </h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Categorise your tasks with custom labels.
            </p>
          </div>

          <Button onClick={() => setIsCreating(true)}>
            <Plus size={17} />
            <span className='hidden sm:inline'>New label</span>
            <span className='sm:hidden'>New</span>
          </Button>
        </header>

        <section>
          {labels.length > 0 ? (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              {labels.map((label) => (
                <LabelCard key={label.id} label={label} />
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-16 text-center'>
              <div className='mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary'>
                <Tag size={25} />
              </div>

              <h3 className='text-base font-semibold text-foreground'>
                No labels yet
              </h3>

              <p className='mt-2 max-w-sm text-sm text-muted-foreground'>
                Create your first label to organise and identify related tasks.
              </p>

              <Button className='mt-5' onClick={() => setIsCreating(true)}>
                <Plus size={16} />
                Create label
              </Button>
            </div>
          )}
        </section>
      </div>

      {isCreating && (
        <LabelFormModal
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
        />
      )}
    </>
  );
}
