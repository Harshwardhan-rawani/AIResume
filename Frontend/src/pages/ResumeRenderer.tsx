// ResumeRenderer.tsx
import { useEffect, useState } from "react";

interface ResumeRendererProps {
  resumeJson: any;
  resumeTemp: { templateIndex?: number };
  color?: string;
  fontSize?: number;
  editorMode?: boolean;
  customStyles?: Record<string, { color: string; fontSize: number }>;
  onFieldEdit?: (section: string, key: string) => void;
}

const ResumeRenderer = ({
  resumeJson,
  resumeTemp,}) => {
  const [TemplateComponent, setTemplateComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    if (!resumeTemp?.templateIndex) return;

    import(`./templates/template${resumeTemp?.templateIndex}.tsx`)
      .then((module) => {
        setTemplateComponent(() => module.default);
      })
      .catch(() => {
        setTemplateComponent(null);
        console.error("Template not found!");
      });
  }, [resumeTemp?.templateIndex]);

  return (
    <div>
      {TemplateComponent ? (
        <TemplateComponent data={resumeJson} />
      ) : (
        <p>Loading Template...</p>
      )}
    </div>
  );
};

export default ResumeRenderer;
