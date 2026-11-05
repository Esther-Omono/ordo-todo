import {
  Palette,
  CalendarDays,
  ListTodo,
  Settings2,
  Download,
} from 'lucide-react';

import { usePreferences } from '../features/preferences/usePreferences';

import { Button } from '../components/ui';
import { exportBackup } from '../features/preferences/dataBackup';

const sectionClass = 'rounded-xl border border-border bg-surface p-5 sm:p-6';

const labelClass = 'text-sm font-medium text-foreground';

const selectClass = `
  w-full rounded-lg border border-border bg-background
  px-3 py-2.5 text-sm text-foreground outline-none
  focus:border-primary focus:ring-2 focus:ring-primary/20
`;

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <section className={sectionClass}>
      <div className='mb-6 flex items-start gap-3'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
          <Icon size={20} />
        </div>

        <div>
          <h2 className='font-semibold text-foreground'>{title}</h2>
          <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
        </div>
      </div>

      <div className='space-y-5'>{children}</div>
    </section>
  );
}

function SettingField({ label, description, children }) {
  return (
    <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <p className={labelClass}>{label}</p>
        {description && (
          <p className='mt-1 text-xs text-muted-foreground'>{description}</p>
        )}
      </div>

      <div className='w-full sm:max-w-56'>{children}</div>
    </div>
  );
}

export default function Settings() {
  const { preferences, setTheme, updatePreference } = usePreferences();

  return (
    <div className='mx-auto w-full max-w-4xl space-y-8'>
      <header>
        <h1 className='text-2xl font-semibold tracking-tight text-foreground'>
          Settings
        </h1>

        <p className='mt-1 text-sm text-muted-foreground'>
          Personalise your Ordo experience.
        </p>
      </header>

      <SettingsSection
        icon={Palette}
        title='Appearance'
        description='Customise how Ordo looks.'
      >
        <SettingField
          label='Theme'
          description='Choose your preferred appearance.'
        >
          <select
            value={preferences.theme}
            onChange={(event) => setTheme(event.target.value)}
            className={selectClass}
          >
            <option value='light'>Light</option>
            <option value='dark'>Dark</option>
          </select>
        </SettingField>
      </SettingsSection>

      <SettingsSection
        icon={CalendarDays}
        title='Date & Calendar'
        description='Configure how dates and calendar weeks are displayed.'
      >
        <SettingField
          label='Date format'
          description='Choose how dates appear throughout Ordo.'
        >
          <select
            value={preferences.dateFormat}
            onChange={(event) =>
              updatePreference('dateFormat', event.target.value)
            }
            className={selectClass}
          >
            <option value='DD/MM/YYYY'>DD/MM/YYYY</option>
            <option value='MM/DD/YYYY'>MM/DD/YYYY</option>
            <option value='YYYY-MM-DD'>YYYY-MM-DD</option>
          </select>
        </SettingField>

        <SettingField
          label='Week starts on'
          description='Choose the first day of your calendar week.'
        >
          <select
            value={preferences.weekStartsOn}
            onChange={(event) =>
              updatePreference('weekStartsOn', Number(event.target.value))
            }
            className={selectClass}
          >
            <option value={1}>Monday</option>
            <option value={0}>Sunday</option>
            <option value={6}>Saturday</option>
          </select>
        </SettingField>
      </SettingsSection>

      <SettingsSection
        icon={ListTodo}
        title='Task preferences'
        description='Set your default task behaviour.'
      >
        <SettingField
          label='Default priority'
          description='Priority automatically assigned to new tasks.'
        >
          <select
            value={preferences.defaultPriority}
            onChange={(event) =>
              updatePreference('defaultPriority', event.target.value)
            }
            className={selectClass}
          >
            <option value='low'>Low</option>
            <option value='medium'>Medium</option>
            <option value='high'>High</option>
          </select>
        </SettingField>
      </SettingsSection>

      <SettingsSection
        icon={Settings2}
        title='Data management'
        description='Back up and restore your Ordo data.'
      >
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-sm font-medium text-foreground'>
              Export your data
            </p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Download a JSON backup of your tasks, projects and preferences.
            </p>
          </div>

          <Button onClick={exportBackup} variant='secondary'>
            <Download size={16} />
            Export data
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
}
