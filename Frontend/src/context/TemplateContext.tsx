import { createContext, useState, ReactNode, useEffect } from "react";
import api from "@/lib/axios";

interface Template {
  _id?: string;
  id?: string; // For backward compatibility
  name: string;
  description: string;
  templateIndex: number;
  category: string;
  thumbnailUrl?: string;
  atsScore?: number; // ATS compatibility score
}

interface TemplateContextType {
  // Template selection
  selectedTemplate: Template | null;
  selectedTemplateId: string | null;
  setSelectedTemplate: (template: Template | null) => void;
  setSelectedTemplateId: (id: string | null) => void;
  
  // Template list management
  templates: Template[];
  loading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  
  // Template creation
  isCreating: boolean;
  createTemplate: (templateData: Partial<Template>) => Promise<void>;
  
  // Template filtering
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  filteredTemplates: Template[];
  
  // Utility functions
  clearSelectedTemplate: () => void;
  getTemplateById: (id: string) => Template | undefined;
  handleLogout: () => void;
}

export const TemplateContext = createContext<TemplateContextType>({
  selectedTemplate: null,
  selectedTemplateId: null,
  setSelectedTemplate: () => {},
  setSelectedTemplateId: () => {},
  templates: [],
  loading: false,
  error: null,
  fetchTemplates: async () => {},
  isCreating: false,
  createTemplate: async () => {},
  activeCategory: 'All',
  setActiveCategory: () => {},
  filteredTemplates: [],
  clearSelectedTemplate: () => {},
  getTemplateById: () => undefined,
  handleLogout: () => {},
});

export const TemplateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  // Filtered templates based on active category
  const filteredTemplates = activeCategory === 'All' 
    ? templates 
    : templates.filter(template => 
        template.category.toLowerCase() === activeCategory.toLowerCase()
      );

  // Fetch templates from backend
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/templates');
      const fetchedTemplates = Array.isArray(response.data.templates) 
        ? response.data.templates 
        : [];
      setTemplates(fetchedTemplates);
    } catch (err) {
      setError('Failed to fetch templates');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new template
  const createTemplate = async (templateData: Partial<Template>) => {
    setIsCreating(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', templateData.name || '');
      formData.append('description', templateData.description || '');
      formData.append('templateIndex', String(templateData.templateIndex || 0));
      formData.append('category', templateData.category || '');
      
      if (templateData.thumbnailUrl) {
        // Handle file upload if needed
        // formData.append('image', file);
      }

      await api.post('/api/templates', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Refresh templates after creation
      await fetchTemplates();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create template');
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  // Utility functions
  const clearSelectedTemplate = () => {
    setSelectedTemplate(null);
    setSelectedTemplateId(null);
  };

  const getTemplateById = (id: string) => {
    return templates.find(template => template._id === id || template.templateIndex.toString() === id);
  };

  // Handle logout - clear all template state
  const handleLogout = () => {
    setSelectedTemplate(null);
    setSelectedTemplateId(null);
    setTemplates([]);
    setActiveCategory('All');
    setError(null);
  };

  // Load selected template from localStorage on mount (for backward compatibility)
  useEffect(() => {
    const savedTemplateId = localStorage.getItem('selectedTemplateIndex');
    if (savedTemplateId) {
      setSelectedTemplateId(savedTemplateId);
      // We'll set the actual template object after templates are loaded
    }
  }, []);

  // Set selected template object when templates are loaded and we have a selectedTemplateId
  useEffect(() => {
    if (selectedTemplateId && templates.length > 0) {
      const template = getTemplateById(selectedTemplateId);
      if (template) {
        setSelectedTemplate(template);
      }
    }
  }, [selectedTemplateId, templates]);

  // Update localStorage when selected template changes (for backward compatibility)
  useEffect(() => {
    if (selectedTemplate) {
      localStorage.setItem('selectedTemplateIndex', selectedTemplate.templateIndex.toString());
    } else {
      localStorage.removeItem('selectedTemplateIndex');
    }
  }, [selectedTemplate]);

  // Fetch templates on mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Listen for logout events
  useEffect(() => {
    const handleUserLogout = () => {
      handleLogout();
    };

    window.addEventListener('userLogout', handleUserLogout);
    
    return () => {
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, []);

  const value: TemplateContextType = {
    selectedTemplate,
    selectedTemplateId,
    setSelectedTemplate,
    setSelectedTemplateId,
    templates,
    loading,
    error,
    fetchTemplates,
    isCreating,
    createTemplate,
    activeCategory,
    setActiveCategory,
    filteredTemplates,
    clearSelectedTemplate,
    getTemplateById,
    handleLogout,
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
};
