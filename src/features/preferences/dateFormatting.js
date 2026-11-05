import { format, isValid, parseISO } from 'date-fns';

const DATE_FORMATS = {
  'DD/MM/YYYY': 'dd/MM/yyyy',
  'MM/DD/YYYY': 'MM/dd/yyyy',
  'YYYY-MM-DD': 'yyyy-MM-dd',
};

export function formatPreferenceDate(value, dateFormat = 'DD/MM/YYYY') {
  if (!value) return '';

  const date = typeof value === 'string' ? parseISO(value) : value;

  if (!isValid(date)) return '';

  const formatString = DATE_FORMATS[dateFormat] || DATE_FORMATS['DD/MM/YYYY'];

  return format(date, formatString);
}

export function formatPreferenceDateTime(value, dateFormat = 'DD/MM/YYYY') {
  const formattedDate = formatPreferenceDate(value, dateFormat);

  if (!formattedDate) return '';

  const date = typeof value === 'string' ? parseISO(value) : value;

  return `${formattedDate}, ${format(date, 'HH:mm')}`;
}
