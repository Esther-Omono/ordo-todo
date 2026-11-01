import { ClipboardList } from 'lucide-react';

export default function EmptyState({
  icon: Icon = ClipboardList,
  title = 'Nothing here yet',
  description = 'Items you add will appear here.',
  action,
}) {
  return (
    <div className='flex flex-col items-center justify-center px-6 py-16 text-center'>
      <div className='mb-4 rounded-2xl bg-primary-soft p-4 text-primary'>
        <Icon size={28} strokeWidth={1.6} />
      </div>

      <h3 className='text-base font-semibold text-foreground'>{title}</h3>

      <p className='mt-2 max-w-sm text-sm text-muted-foreground'>
        {description}
      </p>

      {action && <div className='mt-5'>{action}</div>}
    </div>
  );
}
