import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import { Download, ArrowLeft, Eye, Edit, Share2, Star, Clock, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/axios';
import ResumeRenderer from './ResumeRenderer'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const Preview = () => {
  const params = useParams();
  const [resumeData, setResumeData] = useState<any>(null);
  const [templateData, setTemplateData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [allTemplates, setAllTemplates] = useState<any[]>([]);

  const navigate = useNavigate();
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResume = async () => {
      setLoading(true);
      if (!params.name) {
        setLoading(false);
        return;
      }
      try {
        const apiUrl = import.meta.env.VITE_API_URL + `/api/resume/get/${params.name}`;
        const res = await api.get(apiUrl);
        // Defensive: check if data and final exist
        setResumeData(res.data && res.data.final ? res.data.final : null);

        // Defensive: check for template id and fetch template if present
        const tplId = res.data && res.data.selectedTemplateId;
        if (tplId) {
          try {
            const tplApi = import.meta.env.VITE_API_URL + `/api/templates/${tplId}`;
            const tplRes = await api.get(tplApi);
            setTemplateData(tplRes.data && tplRes.data.template ? tplRes.data.template : null);
          } catch {
            setTemplateData(null);
          }
        } else {
          setTemplateData(null);
        }
      } catch (err) {
        setResumeData(null);
        setTemplateData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [params.name]);

  // Fetch all templates for modal
  useEffect(() => {
    if (!showTemplateModal) return;
    const fetchTemplates = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL + `/api/templates`;
        const res = await api.get(apiUrl);
        setAllTemplates(Array.isArray(res.data.templates) ? res.data.templates : []);
      } catch {
        setAllTemplates([]);
      }
    };
    fetchTemplates();
  }, [showTemplateModal]);

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    // const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = (pdf as any).getImageProperties
      ? (pdf as any).getImageProperties(imgData)
      : { width: canvas.width, height: canvas.height };
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('resume.pdf');
  };

  const handleChangeTemplate = async (templateId: string) => {
    if (!params.name) return;
    try {
      await api.patch(
        import.meta.env.VITE_API_URL + `/api/resume/change-template/${params.name}`,
        { selectedTemplateId: templateId }
      );
      setShowTemplateModal(false);
      
      // Fetch the updated template data
      try {
        const tplApi = import.meta.env.VITE_API_URL + `/api/templates/${templateId}`;
        const tplRes = await api.get(tplApi);
        setTemplateData(tplRes.data && tplRes.data.template ? tplRes.data.template : null);
      } catch {
        setTemplateData(null);
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-96 text-gray-500 text-lg">Loading...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 md:pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Resume Preview
              </h1>
              <p className="text-muted-foreground">
                Review your resume before downloading or sharing
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="outline"
                className="flex items-center gap-2"
                onClick={() => { navigate(`/create/build/${params.name}`) }}>
                <Edit className="h-4 w-4" />
                Edit Resume
              </Button>
              <Button variant="outline" className="flex items-center gap-2"
                onClick={() => setShowTemplateModal(true)}>
                Change
              </Button>
              <Button className="flex items-center gap-2" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
         
          {/* Resume Preview or No Data */}
          <div ref={pdfRef}>
         
              <ResumeRenderer
                resumeJson={resumeData}
                resumeTemp={templateData}
             
              />
           
          </div>
          {/* Template Change Modal */}
          {showTemplateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
                <h2 className="text-lg font-bold mb-4">Select a Template</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {allTemplates.length === 0 ? (
                    <div className="col-span-full text-gray-500 text-center py-8">No templates found.</div>
                  ) : (
                    allTemplates.map((tpl) => (
                      <div
                        key={tpl._id}
                        className={`border rounded p-3 cursor-pointer hover:border-black transition ${
                          templateData && tpl._id === templateData._id ? 'border-black' : 'border-gray-200'
                        }`}
                        onClick={() => handleChangeTemplate(tpl._id)}
                      >
                        <div className="font-semibold">{tpl.name || "Untitled"}</div>
                        <div className="text-xs text-gray-500">{tpl.category || "Uncategorized"}</div>
                        {tpl.thumbnailUrl && (
                          <img src={tpl.thumbnailUrl} alt={tpl.name || "Template"} className="w-full h-24 object-cover rounded mt-2" />
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={() => setShowTemplateModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Preview;
