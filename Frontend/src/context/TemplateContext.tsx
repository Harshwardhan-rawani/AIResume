import { createContext, useState, ReactNode } from "react";

interface TemplateContextType {
  selectedTemplate: number | null;
  setSelectedTemplate: (id: number | null) => void;
}

export const TemplateContext = createContext<TemplateContextType>({
  selectedTemplate: null,
  setSelectedTemplate: () => {},
});

export const TemplateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  return (
    <TemplateContext.Provider value={{ selectedTemplate, setSelectedTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
};
