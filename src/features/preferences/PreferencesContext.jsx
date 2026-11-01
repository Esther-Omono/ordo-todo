import { useEffect, useReducer } from 'react';

import { initialPreferences, preferencesReducer } from './preferencesReducer';

import { storageService, PREFERENCES_KEY } from '../../services/storageService';

import { PreferencesContext } from './preferencesContext';

export { PreferencesContext };

function getInitialPreferences() {
  return storageService.get(PREFERENCES_KEY, initialPreferences);
}

export function PreferencesProvider({ children }) {
  const [preferences, dispatch] = useReducer(
    preferencesReducer,
    undefined,
    getInitialPreferences,
  );

  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      preferences.theme === 'dark',
    );

    document.documentElement.style.colorScheme = preferences.theme;
  }, [preferences.theme]);

  useEffect(() => {
    storageService.set(PREFERENCES_KEY, preferences);
  }, [preferences]);

  const setTheme = (theme) => {
    if (!['light', 'dark'].includes(theme)) return;

    dispatch({
      type: 'SET_THEME',
      payload: theme,
    });
  };

  const updatePreference = (key, value) => {
    dispatch({
      type: 'UPDATE_PREFERENCE',
      payload: { key, value },
    });
  };

  const toggleTheme = () => {
    setTheme(preferences.theme === 'light' ? 'dark' : 'light');
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        setTheme,
        toggleTheme,
        updatePreference,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
