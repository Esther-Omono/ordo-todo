import { useState, useEffect } from 'react';
import { Bell, BellRing, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '../components/ui';
import { useTasks } from '../features/tasks/useTasks';
import { useReminderNotifications } from '../features/reminders/useReminderNotifications';

import { format, isBefore, isValid } from 'date-fns';

export default function Notifications() {
  const { tasks } = useTasks();

  const { permission, supported, settings, updateSettings, requestPermission } =
    useReminderNotifications({ runScheduler: false });

  const [requesting, setRequesting] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalid = window.setInterval(() => {
      setNow(new Date());
    }, 15_000);

    return () => {
      window.clearInterval(intervalid);
    };
  }, []);

  const reminders = tasks.filter(
    (task) => task.reminder?.enabled && task.reminder?.dateTime,
  );

  const upcoming = reminders
    .filter((task) => {
      const date = new Date(task.reminder.dateTime);

      return (
        !task.completed &&
        !task.reminder.notifiedAt &&
        isValid(date) &&
        !isBefore(date, now)
      );
    })
    .sort(
      (a, b) => new Date(a.reminder.dateTime) - new Date(b.reminder.dateTime),
    );

  const history = reminders
    .filter((task) => Boolean(task.reminder.notifiedAt))
    .sort(
      (a, b) =>
        new Date(b.reminder.notifiedAt) - new Date(a.reminder.notifiedAt),
    );

  async function handleEnableBrowserNotifications() {
    setRequesting(true);

    try {
      const result = await requestPermission();

      if (result === 'granted') {
        updateSettings({ browserEnabled: true });

        toast.success('Browser notifications enabled');
      } else if (result === 'denied') {
        toast.error('Notifications are blocked', {
          description: 'Change the permission in your browser settings.',
        });
      } else {
        toast.warning('Browser notifications are unavailable');
      }
    } finally {
      setRequesting(false);
    }
  }

  function toggleSetting(key, value) {
    updateSettings({ [key]: value });

    window.dispatchEvent(new Event('ordo-notification-settings-changed'));

    toast.success(value ? 'Notifications enabled' : 'Notifications disabled');
  }

  function formatReminderDate(value) {
    const date = new Date(value);

    return isValid(date) ? format(date, 'EEE, MMM d · h:mm a') : 'Invalid date';
  }

  return (
    <div className='mx-auto w-full max-w-5xl space-y-8'>
      <header>
        <div className='flex items-center gap-2'>
          <BellRing className='text-primary' size={23} />
          <h2 className='text-2xl font-semibold text-foreground'>
            Notifications
          </h2>
        </div>

        <p className='mt-1 text-sm text-muted-foreground'>
          Manage your reminders and notification preferences.
        </p>
      </header>

      {/* Notification preferences */}
      <section className='space-y-4 rounded-xl border border-border p-5'>
        <h3 className='font-semibold'>Notification preferences</h3>

        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='text-sm font-medium'>In-app notifications</p>
            <p className='text-xs text-muted-foreground'>
              Show Sonner notifications inside Ordo.
            </p>
          </div>

          <input
            type='checkbox'
            checked={settings.inAppEnabled}
            onChange={(event) =>
              toggleSetting('inAppEnabled', event.target.checked)
            }
            className='size-4 accent-primary'
          />
        </div>

        <div className='border-t border-border pt-4'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <p className='text-sm font-medium'>Browser notifications</p>
              <p className='text-xs text-muted-foreground'>
                Show system notifications outside the app window.
              </p>
            </div>

            <input
              type='checkbox'
              checked={settings.browserEnabled}
              disabled={permission !== 'granted'}
              onChange={(event) =>
                toggleSetting('browserEnabled', event.target.checked)
              }
              className='size-4 accent-primary'
            />
          </div>

          <div className='mt-3'>
            {permission === 'granted' ? (
              <p className='text-xs text-success'>
                Browser notification permission granted.
              </p>
            ) : permission === 'denied' ? (
              <p className='text-xs text-danger'>
                Browser notifications are blocked. Change this through your
                browser's site settings.
              </p>
            ) : (
              <Button
                size='sm'
                onClick={handleEnableBrowserNotifications}
                disabled={!supported || requesting}
              >
                {requesting ? 'Requesting...' : 'Enable browser notifications'}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming reminders */}
      <section className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold'>Upcoming reminders</h3>
          <span className='text-xs text-muted-foreground'>
            {upcoming.length} scheduled
          </span>
        </div>

        {upcoming.length === 0 ? (
          <div className='rounded-xl border border-dashed border-border p-8 text-center'>
            <Clock className='mx-auto text-muted-foreground' size={25} />
            <p className='mt-3 text-sm font-medium'>Nothing scheduled</p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Reminders you create will appear here.
            </p>
          </div>
        ) : (
          <div className='divide-y divide-border rounded-xl border border-border'>
            {upcoming.map((task) => (
              <div
                key={task.id}
                className='flex items-center justify-between gap-4 p-4'
              >
                <div className='min-w-0'>
                  <p className='truncate text-sm font-medium'>{task.title}</p>
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {formatReminderDate(task.reminder.dateTime)}
                  </p>
                </div>

                <span className='shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary'>
                  Upcoming
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Notification history */}
      <section className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold'>Notification history</h3>
          <span className='text-xs text-muted-foreground'>
            {history.length} processed
          </span>
        </div>

        {history.length === 0 ? (
          <div className='rounded-xl border border-dashed border-border p-8 text-center'>
            <Bell className='mx-auto text-muted-foreground' size={25} />
            <p className='mt-3 text-sm font-medium'>
              No notification history yet
            </p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Triggered reminders will appear here.
            </p>
          </div>
        ) : (
          <div className='divide-y divide-border rounded-xl border border-border'>
            {history.map((task) => {
              const reminderDate = new Date(task.reminder.dateTime);
              const notifiedDate = new Date(task.reminder.notifiedAt);

              const missed =
                isValid(reminderDate) &&
                isValid(notifiedDate) &&
                notifiedDate.getTime() - reminderDate.getTime() > 5 * 60 * 1000;

              return (
                <div key={task.id} className='flex items-center gap-3 p-4'>
                  {missed ? (
                    <AlertCircle className='shrink-0 text-warning' size={19} />
                  ) : (
                    <CheckCircle2 className='shrink-0 text-success' size={19} />
                  )}

                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>{task.title}</p>

                    <p className='mt-1 text-xs text-muted-foreground'>
                      {isValid(notifiedDate)
                        ? `Processed ${formatReminderDate(task.reminder.notifiedAt)}`
                        : 'Previously processed'}
                    </p>
                  </div>

                  <span className='text-xs text-muted-foreground'>
                    {missed ? 'Missed' : 'Notified'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
