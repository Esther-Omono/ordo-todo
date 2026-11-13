import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useTasks } from '../tasks/useTasks';

import {
  getNotificationPermission,
  requestNotificationPermission,
  showTaskNotification,
} from './notificationService';

import { isReminderDue, isReminderMissed } from './reminderUtils';

const SETTINGS_KEY = 'ordo-notification-settings';

const DEFAULT_SETTINGS = {
  inAppEnabled: true,
  browserEnabled: true,
};

function getNotificationSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));

    return {
      ...DEFAULT_SETTINGS,
      ...(saved && typeof saved === 'object' ? saved : {}),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useReminderNotifications({ runScheduler = true } = {}) {
  const { tasks, updateTask } = useTasks();

  const [permission, setPermission] = useState(getNotificationPermission);

  const [settings, setSettings] = useState(getNotificationSettings);

  const notifiedTasks = useRef(new Set());

  const supported = permission !== 'unsupported';

  const updateSettings = useCallback((updates) => {
    setSettings((previous) => {
      const next = { ...previous, ...updates };

      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));

      return next;
    });
  }, []);

  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();

    setPermission(result);

    return result;
  }, []);

  const checkReminders = useCallback(() => {
    const now = new Date();

    tasks.forEach((task) => {
      const reminder = task.reminder;

      if (!reminder || !reminder.dateTime) {
        return;
      }

      const reminderKey = `${task.id}:${reminder.dateTime}`;

      if (
        task.completed ||
        !isReminderDue(reminder, now) ||
        notifiedTasks.current.has(reminderKey)
      ) {
        return;
      }

      notifiedTasks.current.add(reminderKey);

      const missed = isReminderMissed(reminder, now);

      try {
        if (settings.inAppEnabled) {
          if (missed) {
            toast.warning('You missed a task reminder', {
              description: `"${task.title}" was scheduled earlier.`,
              duration: 6000,
            });
          } else {
            toast.info('Task reminder', {
              description: `It's time to work on "${task.title}".`,
              duration: 6000,
            });
          }
        }

        if (
          settings.browserEnabled &&
          getNotificationPermission() === 'granted'
        ) {
          showTaskNotification(task, missed);
        }

        updateTask(task.id, {
          reminder: {
            ...reminder,
            notifiedAt: new Date().toISOString(),
          },
        });
      } catch (error) {
        notifiedTasks.current.delete(reminderKey);

        console.error(`Could not process reminder for ${task.title}:`, error);
      }
    });
  }, [tasks, updateTask, settings]);

  useEffect(() => {
    if (!runScheduler) return;

    checkReminders();

    const intervalId = window.setInterval(() => {
      checkReminders();
      setPermission(getNotificationPermission());
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [checkReminders, runScheduler]);

  useEffect(() => {
    function syncSettings() {
      setSettings(getNotificationSettings());
    }

    window.addEventListener('ordo-notification-settings-changed', syncSettings);

    return () => {
      window.removeEventListener(
        'ordo-notification-settings-changed',
        syncSettings,
      );
    };
  }, []);

  return {
    permission,
    supported,
    settings,
    updateSettings,
    requestPermission,
    checkReminders,
  };
}
