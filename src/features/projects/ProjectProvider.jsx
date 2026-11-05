import { useEffect, useReducer } from 'react';

import { ProjectContext } from './projectContext';
import { projectReducer } from './projectReducer';
import { loadProjects, saveProjects } from './projectStorage';
import { useTasks } from '../tasks/useTasks';

export function ProjectProvider({ children }) {
  const [projects, dispatch] = useReducer(
    projectReducer,
    undefined,
    loadProjects,
  );

  const { tasks, updateTask } = useTasks();

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  function addProject(projectData) {
    const now = new Date().toISOString();

    const newProject = {
      id: crypto.randomUUID(),
      ...projectData,
      createdAt: now,
      updatedAt: now,
    };

    dispatch({
      type: 'ADD_PROJECT',
      payload: newProject,
    });

    return newProject;
  }

  function updateProject(id, updates) {
    dispatch({
      type: 'UPDATE_PROJECT',
      payload: {
        id,
        updates: {
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      },
    });
  }

  function deleteProject(id) {
    // Unassign tasks before deleting the project.
    tasks
      .filter((task) => task.projectId === id)
      .forEach((task) => {
        updateTask(task.id, { projectId: null });
      });

    dispatch({
      type: 'DELETE_PROJECT',
      payload: id,
    });
  }

  function replaceProjects(projects) {
    dispatch({
      type: 'LOAD_PROJECTS',
      payload: projects,
    });
  }

  const value = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    replaceProjects,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}
