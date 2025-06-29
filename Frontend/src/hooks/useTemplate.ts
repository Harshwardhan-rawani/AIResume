import { useContext } from 'react';
import { TemplateContext } from '@/context/TemplateContext';

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  
  if (!context) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  
  return context;
}; 