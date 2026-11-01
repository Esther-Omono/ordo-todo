import { Moon, Sun } from 'lucide-react';
import { usePreferences } from '../../features/preferences/usePreferences';
import Button from './Button';

export default function ThemeToggle() {
  const { preferences, toggleTheme } = usePreferences();

  const isDark = preferences.theme === 'dark';

  return (
    <Button
      variant='ghost'
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
    </Button>
  );
}
