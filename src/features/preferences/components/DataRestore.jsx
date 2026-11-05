import { useRef, useState } from 'react';
import {
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  FileJson,
} from 'lucide-react';

import { Button } from '../../../components/ui';
import { useTasks } from '../../tasks/useTasks';
import { useProjects } from '../../projects/useProjects';
import { usePreferences } from '../usePreferences';
import { readBackupFile } from '../dataBackup';

export default function DataRestore() {
  const fileInputRef = useRef(null);

  const { replaceTasks } = useTasks();
  const { replaceProjects } = useProjects();
  const { loadPreferences } = usePreferences();

  const [backup, setBackup] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isReading, setIsReading] = useState(false);

  function resetSelection() {
    setBackup(null);
    setFileName('');
    setError('');
    setSuccess('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsReading(true);
    setBackup(null);
    setError('');
    setSuccess('');

    try {
      const parsedBackup = await readBackupFile(file);

      setBackup(parsedBackup);
      setFileName(file.name);
    } catch (err) {
      setError(err.message || 'Unable to read backup file.');
    } finally {
      setIsReading(false);
    }
  }

  function handleRestore() {
    if (!backup) return;

    const confirmed = window.confirm(
      'Restoring this backup will replace all your current tasks, projects and preferences. This action cannot be undone. Continue?',
    );

    if (!confirmed) return;

    try {
      replaceTasks(backup.data.tasks);
      replaceProjects(backup.data.projects);
      loadPreferences(backup.data.preferences);

      setSuccess('Your Ordo data has been successfully restored.');
      setBackup(null);
      setFileName('');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch {
      setError('Something went wrong while restoring your data.');
    }
  }

  return (
    <div className='space-y-5'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h3 className='text-sm font-medium text-foreground'>
            Restore your data
          </h3>
          <p className='mt-1 text-xs text-muted-foreground'>
            Import a previously exported Ordo backup.
          </p>
        </div>

        <Button
          variant='secondary'
          onClick={() => fileInputRef.current?.click()}
          disabled={isReading}
        >
          <Upload size={16} />
          {isReading ? 'Reading backup...' : 'Choose backup'}
        </Button>

        <input
          ref={fileInputRef}
          type='file'
          accept='.json,application/json'
          onChange={handleFileChange}
          className='hidden'
        />
      </div>

      {error && (
        <div
          role='alert'
          className='flex gap-3 rounded-lg border border-danger/30 bg-danger/5 p-3'
        >
          <AlertTriangle size={18} className='shrink-0 text-danger' />
          <p className='whitespace-pre-line text-sm text-danger'>{error}</p>
        </div>
      )}

      {success && (
        <div
          role='status'
          className='flex gap-3 rounded-lg border border-success/30 bg-success/5 p-3'
        >
          <CheckCircle2 size={18} className='shrink-0 text-success' />
          <p className='text-sm text-foreground'>{success}</p>
        </div>
      )}

      {backup && (
        <div className='space-y-4 rounded-xl border border-border bg-background p-4'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
              <FileJson size={20} />
            </div>

            <div className='min-w-0'>
              <p className='truncate text-sm font-medium text-foreground'>
                {fileName}
              </p>
              <p className='text-xs text-muted-foreground'>
                Valid Ordo backup · Version {backup.version}
              </p>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-3'>
            <div className='rounded-lg bg-surface p-3 text-center'>
              <p className='text-xl font-semibold text-foreground'>
                {backup.data.tasks.length}
              </p>
              <p className='text-xs text-muted-foreground'>Tasks</p>
            </div>

            <div className='rounded-lg bg-surface p-3 text-center'>
              <p className='text-xl font-semibold text-foreground'>
                {backup.data.projects.length}
              </p>
              <p className='text-xs text-muted-foreground'>Projects</p>
            </div>

            <div className='rounded-lg bg-surface p-3 text-center'>
              <p className='text-xl font-semibold text-foreground'>
                {backup.data.tasks.reduce(
                  (total, task) => total + task.subtasks.length,
                  0,
                )}
              </p>
              <p className='text-xs text-muted-foreground'>Subtasks</p>
            </div>
          </div>

          <p className='text-xs text-muted-foreground'>
            Exported: {new Date(backup.exportedAt).toLocaleString()}
          </p>

          <div className='rounded-lg border border-danger/30 bg-danger/5 p-3'>
            <div className='flex gap-2'>
              <AlertTriangle size={17} className='shrink-0 text-danger' />
              <p className='text-xs leading-5 text-foreground'>
                Restoring will replace your existing tasks, projects and
                preferences. Export your current data first if you want to keep
                a backup.
              </p>
            </div>
          </div>

          <div className='flex flex-wrap justify-end gap-2'>
            <Button variant='secondary' onClick={resetSelection}>
              Cancel
            </Button>

            <Button variant='destructive' onClick={handleRestore}>
              <Download size={16} />
              Restore backup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
