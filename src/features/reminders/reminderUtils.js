export function toDateTimeLocalValue(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

export function toISOStringFromLocal(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

export function isReminderDue(reminder, now = new Date()) {
  if (!reminder?.enabled || reminder.notifiedAt || !reminder.dateTime) {
    return false;
  }

  const reminderDate = new Date(reminder.dateTime);

  if (Number.isNaN(reminderDate.getTime())) return false;

  return reminderDate.getTime() <= now.getTime();
}

export function isReminderMissed(reminder, now = new Date()) {
  if (!isReminderDue(reminder, now)) return false;

  const reminderDate = new Date(reminder.dateTime);

  return now.getTime() - reminderDate.getTime() > 5 * 60 * 1000;
}
