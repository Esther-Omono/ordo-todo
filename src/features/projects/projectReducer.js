export function projectReducer(state, action) {
  switch (action.type) {
    case 'ADD_PROJECT':
      return [...state, action.payload];

    case 'UPDATE_PROJECT':
      return state.map((project) =>
        project.id === action.payload.id
          ? { ...project, ...action.payload.updates }
          : project,
      );

    case 'DELETE_PROJECT':
      return state.filter((project) => project.id !== action.payload);

    case 'LOAD_PROJECTS':
      return action.payload;

    default:
      return state;
  }
}
