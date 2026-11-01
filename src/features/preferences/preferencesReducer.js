export const initialPreferences = {
  theme: 'light',
  dateFormat: 'DD/MM/YYYY',
  weekStartsOn: 1,
  defaultPriority: 'medium',
};

export function preferencesReducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };

    case 'UPDATE_PREFERENCE':
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    case 'LOAD_PREFERENCES':
      return {
        ...initialPreferences,
        ...action.payload,
      };

    default:
      return state;
  }
}
