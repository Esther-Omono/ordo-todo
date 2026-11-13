import { useContext } from 'react';
import { LabelContext } from '../context/labelContext';

export function useLabels() {
  const context = useContext(LabelContext);

  if (!context) {
    throw new Error('useLabels must be used within LabelProvider');
  }

  return context;
}
