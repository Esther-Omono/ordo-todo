export function isNotificationSupported() {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    window.isSecureContext
  );
}

export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';

  return Notification.permission;
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';

  if (Notification.permission !== 'default') {
    return Notification.permission;
  }

  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.error('Unable to request notification permission:', error);
    return 'default';
  }
}

export function showTaskNotification(task, isMissed = false) {
  if (getNotificationPermission() !== 'granted') return null;

  const notification = new Notification(
    isMissed ? 'Missed task reminder' : 'Task reminder',
    {
      body: isMissed
        ? `"${task.title}" was scheduled for an earlier time.`
        : `It's time to work on "${task.title}".`,
      icon: '/favicon.ico',
      tag: `ordo-reminder-${task.id}`,
    },
  );

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  return notification;
}
