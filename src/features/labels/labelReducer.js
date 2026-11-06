export function labelReducer(state, action) {
  switch (action.type) {
    case 'ADD_LABEL':
      return [...state, action.payload];

    case 'UPDATE_LABEL':
      return state.map((label) =>
        label.id === action.payload.id
          ? { ...label, ...action.payload.updates }
          : label,
      );

    case 'DELETE_LABEL':
      return state.filter((label) => label.id !== action.payload);

    case 'LOAD_LABELS':
      return action.payload;

    default:
      return state;
  }
}
